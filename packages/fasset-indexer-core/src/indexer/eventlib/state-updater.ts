import { EntityManager, NotFoundError } from "@mikro-orm/knex"
import { AddressType } from "../../database/entities/address"
import { AgentManager, AgentOwner, AgentVault } from "../../database/entities/agent"
import { UntrackedAgentVault } from "../../database/entities/state/var"
import { updateAgentVaultInfo } from "../shared"
import { EventStorer } from "./event-storer"
import { ADDRESS_LENGTH } from "../../constants"
import type { FullLog } from "./event-scraper"
import type { Context } from "../../context"
import type { EvmLog } from "../../database/entities/logs"
import type { AgentVaultCreatedEvent } from "../../../chain/typechain/AMEvents"


// binds chain reading to event storage
export class StateUpdater extends EventStorer {

  constructor(public readonly context: Context) {
    super()
  }

  async onNewEvent(log: FullLog): Promise<void> {
    if (this.context.ignoreLog(log.name)) return
    try {
      await this.context.orm.em.fork().transactional(async (em) => {
        await this.processLog(em, log)
      })
    } catch (e: any) {
      if (await this.errorKindaOk(log, e)) {
        return console.log(`ignoring error ${e} for log ${log.name}`)
      }
      throw new Error(`unknown error ${e}`)
    }
  }

  protected override async onAgentVaultCreated(em: EntityManager, evmLog: EvmLog, args: AgentVaultCreatedEvent.OutputTuple): Promise<AgentVault> {
    const [ owner, ] = args
    const manager = await this.ensureAgentManager(em, owner)
    await this.ensureAgentOwner(em, manager)
    const agentVaultEntity = await super.onAgentVaultCreated(em, evmLog, args)
    await this.updateAgentVaultInfo(em, agentVaultEntity)
    return agentVaultEntity
  }

  private async ensureAgentManager(em: EntityManager, address: string): Promise<AgentManager> {
    let agentManager = await em.findOne(AgentManager, { address: { hex: address }}, { populate: ['address'] })
    if (agentManager === null) {
      agentManager = await this.findOrCreateAgentManager(em, address, true)
      em.persist(agentManager)
    }
    return agentManager
  }

  private async ensureAgentOwner(em: EntityManager, manager: AgentManager): Promise<AgentOwner> {
    let agentOwner = await em.findOne(AgentOwner, { manager })
    if (agentOwner === null) {
      const address = await this.context.agentOwnerRegistryContract.getWorkAddress(manager.address.hex)
      const evmAddress = await this.findOrCreateEvmAddress(em, address, AddressType.AGENT)
      agentOwner = new AgentOwner(evmAddress, manager)
      em.persist(agentOwner)
    }
    return agentOwner
  }

  private async findOrCreateAgentManager(em: EntityManager, manager: string, full: boolean): Promise<AgentManager> {
    let agentManager = await em.findOne(AgentManager, { address: { hex: manager }})
    if (agentManager === null) {
      const managerEvmAddress = await this.findOrCreateEvmAddress(em, manager, AddressType.AGENT)
      agentManager = new AgentManager(managerEvmAddress)
    }
    if (full && agentManager.name === undefined) {
      agentManager.name = await this.context.agentOwnerRegistryContract.getAgentName(manager)
      agentManager.description = await this.context.agentOwnerRegistryContract.getAgentDescription(manager)
      agentManager.iconUrl = await this.context.agentOwnerRegistryContract.getAgentIconUrl(manager)
    }
    return agentManager
  }

  private async updateAgentVaultInfo(em: EntityManager, agentVault: AgentVault): Promise<void> {
    try {
      await updateAgentVaultInfo(this.context, em, agentVault.address.hex)
    } catch (e: any) {
      if (e?.reason === 'invalid agent vault address') {
        return await em.transactional(async (em) => {
          const address = e.invocation.args[0]
          const untrackedAgentVault = new UntrackedAgentVault(address)
          agentVault.destroyed = true
          em.persist(untrackedAgentVault)
        })
      }
      throw e
    }
  }

  private async errorKindaOk(log: FullLog, error: any): Promise<boolean> {
    if (error instanceof NotFoundError) {
      const em = this.context.orm.em.fork()
      const fullInfo = error.message + " " + log.args.filter(
        (arg) => StateUpdater.consideredAddress(arg)).join(' ')
      const matches = fullInfo.match(/'(0x[a-fA-F0-9]{40})'/)
      if (matches === null) return false
      for (const match of matches) {
        if (await StateUpdater.isUntracked(em, match))
          return true
      }
    }
    return false
  }

  private static consideredAddress(arg: any): boolean {
    return typeof arg === 'string' && arg.startsWith('0x') && arg.length === ADDRESS_LENGTH
  }

  private static async isUntracked(em: EntityManager, address: string): Promise<boolean> {
    const untracked = await em.fork().findOne(UntrackedAgentVault, { address })
    return untracked !== null
  }

}
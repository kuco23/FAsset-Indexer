import { EntityManager, NotFoundError } from "@mikro-orm/knex"
import { AgentManager, AgentOwner, AgentVault } from "../../database/entities/agent"
import { VaultCollateralToken } from "../../database/entities/token"
import { UntrackedAgentVault } from "../../database/entities/state/var"
import { updateAgentVaultInfo } from "../shared"
import { EventStorer } from "./event-storer"
import { ADDRESS_LENGTH } from "../../constants"
import type { EventArgs, FullLog } from "./event-scraper"
import type { Context } from "../../context"


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

  protected override async onAgentVaultCreated(em: EntityManager, args: EventArgs): Promise<AgentVault> {
    const [ owner,,,, vaultCollateralToken ] = args
    await this.ensureStoredCollateralToken(em, vaultCollateralToken)
    const manager = await this.ensureAgentManager(em, owner)
    await this.ensureAgentOwner(em, manager)
    const agentVaultEntity = await super.onAgentVaultCreated(em, args)
    await this.updateAgentVaultInfo(em, agentVaultEntity)
    return agentVaultEntity
  }

  private async ensureAgentManager(em: EntityManager, address: string): Promise<AgentManager> {
    let agentManager = await em.findOne(AgentManager, { address })
    if (agentManager === null) {
      agentManager = await this.getAgentManager(em, address, true)
      em.persist(agentManager)
    }
    return agentManager
  }

  private async ensureAgentOwner(em: EntityManager, manager: AgentManager): Promise<AgentOwner> {
    let agentOwner = await em.findOne(AgentOwner, { manager })
    if (agentOwner === null) {
      const address = await this.context.agentOwnerRegistryContract.getWorkAddress(manager.address)
      agentOwner = new AgentOwner(address, manager)
      em.persist(agentOwner)
    }
    return agentOwner
  }

  private async getAgentManager(em: EntityManager, manager: string, full: boolean): Promise<AgentManager> {
    let agentManager = await em.findOne(AgentManager, { address: manager })
    if (agentManager === null) {
      agentManager = new AgentManager(manager)
    }
    if (full && agentManager.name === undefined) {
      agentManager.name = await this.context.agentOwnerRegistryContract.getAgentName(agentManager.address)
      agentManager.description = await this.context.agentOwnerRegistryContract.getAgentDescription(agentManager.address)
      agentManager.iconUrl = await this.context.agentOwnerRegistryContract.getAgentIconUrl(agentManager.address)
    }
    return agentManager
  }

  private async updateAgentVaultInfo(em: EntityManager, agentVault: AgentVault): Promise<void> {
    try {
      await updateAgentVaultInfo(this.context, em, agentVault.address)
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

  private async ensureStoredCollateralToken(em: EntityManager, tokenAddress: string): Promise<void> {
    let collateralTokenEntity = await em.findOne(VaultCollateralToken, { address: tokenAddress })
    if (collateralTokenEntity !== null) return
    const assetManager = this.context.getAssetManagerContract("FTestXRP")
    const collateralType = await assetManager.getCollateralType(2, tokenAddress)
    const decimals = await this.context.getERC20(tokenAddress).decimals()
    collateralTokenEntity = new VaultCollateralToken(
      tokenAddress,
      Number(decimals),
      collateralType.directPricePair,
      collateralType.assetFtsoSymbol,
      collateralType.tokenFtsoSymbol
    )
    em.persist(collateralTokenEntity)
  }

  private async errorKindaOk(log: FullLog, error: any): Promise<boolean> {
    if (error instanceof NotFoundError) {
      const em = this.context.orm.em.fork()
      const fullInfo = error.message + " " + log.args.filter(
        (arg) => StateUpdater.consideredAddress(arg)).join(' ')
      const matches = fullInfo.match(/'(0x[a-fA-F0-9]{40})'/)
      if (matches === null) return false
      for (const match of matches) {
        if (await StateUpdater.isUntracked(em, match)) return true
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
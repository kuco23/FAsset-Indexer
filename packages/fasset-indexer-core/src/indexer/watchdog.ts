import { EntityManager } from "@mikro-orm/knex"
import { sleep } from "../utils"
import { AgentVault } from "../database/entities/agent"
import { updateAgentVaultInfo } from "./shared"
import { Context } from "../context"
import { MID_CHAIN_FETCH_SLEEP_MS, STATE_UPDATE_SLEEP_MS } from "../constants"


export class StateWatchdog {

  constructor(public readonly context: Context) {}

  async run(): Promise<void> {
    while (true) {
      await this.context.orm.connect()
      await this.watchAgentInfo(this.context.orm.em.fork())
      await sleep(STATE_UPDATE_SLEEP_MS)
      await this.context.orm.close()
    }
  }

  async watchAgentInfo(em: EntityManager): Promise<void> {
    const agents = await em.find(AgentVault, { destroyed: false })
    for (const agent of agents) {
      await updateAgentVaultInfo(this.context, em, agent.address)
      await sleep(MID_CHAIN_FETCH_SLEEP_MS)
    }
  }

}
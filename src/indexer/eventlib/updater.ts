import { EntityManager } from "@mikro-orm/knex"
import { EvmLog } from "../../database/entities/logs"
import { VaultCollateralToken } from "../../database/entities/token"
import { EventStorer } from "./storer"
import type { EventArgs, FullLog } from "./scraper"
import type { Context } from "../../context"
import { updateAgentVaultInfo } from "../shared"


// binds chain reading to event storage
export class StateUpdater extends EventStorer {

  constructor(public readonly context: Context) {
    super()
  }

  async onNewEvent(log: FullLog): Promise<void> {
    if (this.context.ignoreLog(log.name)) return
    await this.context.orm.em.fork().transactional(async (em) => {
      const evmLog = await em.findOne(EvmLog, {
        blockNumber: log.blockNumber,
        transactionIndex: log.transactionIndex,
        logIndex: log.logIndex
      })
      if (evmLog === null) {
        await this.processLog(em, log)
      }
    })
  }

  protected override async onAgentVaultCreated(em: EntityManager, args: EventArgs): Promise<void> {
    const [ , agentVault,,, vaultCollateralToken ] = args
    await this.assureStoredCollateralToken(em, vaultCollateralToken)
    await super.onAgentVaultCreated(em, args)
    await updateAgentVaultInfo(this.context, em, agentVault)
  }

  private async assureStoredCollateralToken(em: EntityManager, tokenAddress: string): Promise<void> {
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
    await em.persistAndFlush(collateralTokenEntity)
  }

}
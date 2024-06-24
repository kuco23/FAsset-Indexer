import { EvmLog } from "../../database/entities/logs"
import { VaultCollateralToken } from "../../database/entities/token"
import { AgentManager, AgentOwner, AgentVault } from "../../database/entities/agent"
import { AgentVaultInfo, AgentVaultSettings } from "../../database/entities/state/agent"
import {
  CollateralReservationDeleted,
  CollateralReserved, MintingExecuted,
  MintingPaymentDefault
} from "../../database/entities/events/minting"
import {
  RedemptionRequested, RedemptionPerformed, RedemptionDefault,
  RedemptionPaymentFailed, RedemptionPaymentBlocked, RedemptionRejected
} from "../../database/entities/events/redemption"
import {
  FullLiquidationStarted, LiquidationEnded, LiquidationPerformed, LiquidationStarted
} from "../../database/entities/events/liquidation"
import {
  AgentSettingChanged, RedemptionRequestIncomplete
} from "../../database/entities/events/tracking"
import {
  AGENT_VAULT_CREATED, AGENT_SETTING_CHANGED,
  COLLATERAL_RESERVED, MINTING_EXECUTED, MINTING_PAYMENT_DEFAULT, COLLATERAL_RESERVATION_DELETED,
  REDEMPTION_REQUESTED, REDEMPTION_PERFORMED, REDEMPTION_DEFAULT, REDEMPTION_PAYMENT_BLOCKED,
  REDEMPTION_PAYMENT_FAILED, REDEMPTION_REJECTED, REDEMPTION_REQUEST_INCOMPLETE,
  LIQUIDATION_STARTED, LIQUIDATION_PERFORMED, LIQUIDATION_ENDED, FULL_LIQUIDATION_STARTED,
  AGENT_ENTERED_AVAILABLE, AVAILABLE_AGENT_EXITED, AGENT_DESTROYED
} from '../../constants'
import type { EntityManager } from "@mikro-orm/knex"
import type { FullLog, EventArgs } from "./scraper"


export abstract class EventStorer {

  async processLog(em: EntityManager, log: FullLog): Promise<void> {
    const evmLog = await this.getLogEntity(em, log)
    switch (log.name) {
      case AGENT_VAULT_CREATED: {
        await this.onAgentVaultCreated(em, log.args)
        break
      } case AGENT_SETTING_CHANGED: {
        await this.onAgentSettingChanged(em, evmLog, log.args)
        break
      } case COLLATERAL_RESERVED: {
        await this.onCollateralReserved(em, evmLog, log.args)
        break
      } case AGENT_DESTROYED: {
        await this.onAgentDestroyed(em, log.args)
      } case MINTING_EXECUTED: {
        await this.onMintingExecuted(em, evmLog, log.args)
        break
      } case MINTING_PAYMENT_DEFAULT: {
        await this.onMintingPaymentDefault(em, evmLog, log.args)
        break
      } case COLLATERAL_RESERVATION_DELETED: {
        await this.onCollateralReservationDeleted(em, evmLog, log.args)
        break
      } case REDEMPTION_REQUESTED: {
        await this.onRedemptionRequested(em, evmLog, log.args)
        break
      } case REDEMPTION_PERFORMED: {
        await this.onRedemptionPerformed(em, evmLog, log.args)
        break
      } case REDEMPTION_DEFAULT: {
        await this.onRedemptionDefault(em, evmLog, log.args)
        break
      } case REDEMPTION_PAYMENT_BLOCKED: {
        await this.onRedemptionPaymentBlocked(em, evmLog, log.args)
        break
      } case REDEMPTION_PAYMENT_FAILED: {
        await this.onRedemptionPaymentFailed(em, evmLog, log.args)
        break
      } case REDEMPTION_REJECTED: {
        await this.onRedemptionRejected(em, evmLog, log.args)
        break
      } case REDEMPTION_REQUEST_INCOMPLETE: {
        await this.onRedemptionPaymentIncomplete(em, evmLog, log.args)
        break
      } case LIQUIDATION_STARTED: {
        await this.onLiquidationStarted(em, evmLog, log.args)
        break
      } case LIQUIDATION_PERFORMED: {
        await this.onLiquidationPerformed(em, evmLog, log.args)
        break
      } case FULL_LIQUIDATION_STARTED: {
        await this.onFullLiquidationStarted(em, evmLog, log.args)
        break
      } case LIQUIDATION_ENDED: {
        await this.onLiquidationEnded(em, evmLog, log.args)
        break
      } case AVAILABLE_AGENT_EXITED: {
        await this.onAvailableAgentExited(em, log.args)
      } case AGENT_ENTERED_AVAILABLE: {
        await this.onAgentEnteredAvailable(em, log.args)
      } default: {
        break
      }
    }
  }

  // assumed this is in the same orm-transaction as every other method below
  protected async getLogEntity(em: EntityManager, log: FullLog): Promise<EvmLog> {
    const evmLog = new EvmLog(
      log.blockNumber, log.transactionIndex, log.logIndex,
      log.name, log.source, log.transactionHash, log.blockTimestamp)
    em.persist(evmLog)
    return evmLog
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // agent

  protected async onAgentVaultCreated(em: EntityManager, logArgs: EventArgs): Promise<AgentVault> {
    const [
      owner, agentVault, collateralPool, underlyingAddress, vaultCollateralToken,
      feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS, mintingPoolCollateralRatioBIPS,
      buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS, poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    ] = logArgs
    const agentOwnerEntity = await em.findOneOrFail(AgentOwner, { manager: { address: owner }}) // todo: this may change
    const agentVaultEntity = new AgentVault(agentVault, underlyingAddress, collateralPool, agentOwnerEntity, false)
    const vaultCollateralTokenEntity = await em.findOneOrFail(VaultCollateralToken, { address: vaultCollateralToken })
    const agentVaultSettings = new AgentVaultSettings(
      agentVaultEntity, vaultCollateralTokenEntity, feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS,
      mintingPoolCollateralRatioBIPS, buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS,
      poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    )
    em.persist([agentVaultEntity, agentVaultSettings])
    return agentVaultEntity
  }

  protected async onAgentSettingChanged(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ agentVault, name, value ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const agentSettingChanged = new AgentSettingChanged(evmLog, agentVaultEntity, name, value)
    const agentSettings = await em.findOneOrFail(AgentVaultSettings, { agentVault: agentVaultEntity })
    this.applyAgentSettingChange(agentSettings, name, value) // also change setting value in db
    em.persist([agentSettingChanged, agentSettings])
  }

  protected async onAvailableAgentExited(em: EntityManager, logArgs: EventArgs): Promise<void> {
    const [ agentVault ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVaultInfo, { agentVault: { address: agentVault }})
    agentVaultEntity.publiclyAvailable = false
    em.persist(agentVaultEntity)
  }

  protected async onAgentEnteredAvailable(em: EntityManager, logArgs: EventArgs): Promise<void> {
    const [ agentVault, ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVaultInfo, { agentVault: { address: agentVault }})
    agentVaultEntity.publiclyAvailable = true
    em.persist(agentVaultEntity)
  }

  protected async onAgentDestroyed(em: EntityManager, logArgs: EventArgs): Promise<void> {
    const [ agentVault ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    agentVaultEntity.destroyed = true
    em.persist(agentVaultEntity)
  }

  private applyAgentSettingChange(agentSettings: AgentVaultSettings, name: string, value: string): void {
    switch (name) {
      case "feeBIPS": {
        agentSettings.feeBIPS = BigInt(value)
        break
      } case "poolFeeShareBIPS": {
        agentSettings.poolFeeShareBIPS = BigInt(value)
        break
      } case "mintingVaultCollateralRatioBIPS": {
        agentSettings.mintingVaultCollateralRatioBIPS = BigInt(value)
        break
      } case "mintingPoolCollateralRatioBIPS": {
        agentSettings.mintingPoolCollateralRatioBIPS = BigInt(value)
        break
      } case "buyFAssetByAgentFactorBIPS": {
        agentSettings.buyFAssetByAgentFactorBIPS = BigInt(value)
        break
      } case "poolExitCollateralRatioBIPS": {
        agentSettings.poolExitCollateralRatioBIPS = BigInt(value)
        break
      } case "poolTopupCollateralRatioBIPS": {
        agentSettings.poolTopupCollateralRatioBIPS = BigInt(value)
        break
      } case "poolTopupTokenPriceFactorBIPS": {
        agentSettings.poolTopupTokenPriceFactorBIPS = BigInt(value)
        break
      } default: {
        break
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // mintings

  protected async onCollateralReserved(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [
      agentVault, minter, collateralReservationId, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const collateralReserved = new CollateralReserved(evmLog,
      collateralReservationId, agentVaultEntity, minter, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    )
    em.persist(collateralReserved)
  }

  protected async onMintingExecuted(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ , collateralReservationId,,, poolFeeUBA ] = logArgs
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingExecuted = new MintingExecuted(evmLog, collateralReserved, poolFeeUBA)
    em.persist(mintingExecuted)
  }

  protected async onMintingPaymentDefault(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, collateralReservationId, ] = logArgs
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingPaymentDefault = new MintingPaymentDefault(evmLog, collateralReserved)
    em.persist(mintingPaymentDefault)
  }

  protected async onCollateralReservationDeleted(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, collateralReservationId, ] = logArgs
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const collateralReservationDeleted = new CollateralReservationDeleted(evmLog, collateralReserved)
    em.persist(collateralReservationDeleted)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // redemptions

  protected async onRedemptionRequested(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [
      agentVault, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const redemptionRequested = new RedemptionRequested(evmLog,
      agentVaultEntity, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    )
    em.persist(redemptionRequested)
  }

  protected async onRedemptionPerformed(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, requestId, transactionHash, spentUnderlyingUBA ] = logArgs
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPerformed = new RedemptionPerformed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
    em.persist(redemptionPerformed)
  }

  protected async onRedemptionDefault(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, requestId,, redeemedVaultCollateralWei, redeemedPoolCollateralWei ] = logArgs
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionDefault = new RedemptionDefault(evmLog, redemptionRequested, redeemedVaultCollateralWei, redeemedPoolCollateralWei)
    em.persist(redemptionDefault)
  }

  protected async onRedemptionPaymentBlocked(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, requestId, transactionHash,, spentUnderlyingUBA ] = logArgs
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentBlocked = new RedemptionPaymentBlocked(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
    em.persist(redemptionPaymentBlocked)
  }

  protected async onRedemptionPaymentFailed(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, requestId, transactionHash, spentUnderlyingUBA, failureReason ] = logArgs
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentFailed = new RedemptionPaymentFailed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA, failureReason)
    em.persist(redemptionPaymentFailed)
  }

  protected async onRedemptionRejected(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ ,, requestId, ] = logArgs
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionRejected = new RedemptionRejected(evmLog, redemptionRequested)
    em.persist(redemptionRejected)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // liquidations

  protected async onLiquidationStarted(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ agentVault, timestamp ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationStarted = new LiquidationStarted(evmLog, agentVaultEntity, timestamp)
    em.persist(liquidationStarted)
  }

  protected async onFullLiquidationStarted(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ agentVault, timestamp ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationPerformed = new FullLiquidationStarted(evmLog, agentVaultEntity, timestamp)
    em.persist(liquidationPerformed)
  }

  protected async onLiquidationPerformed(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ agentVault, liquidator, valueUBA ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationPerformed = new LiquidationPerformed(evmLog, agentVaultEntity, liquidator, valueUBA)
    em.persist(liquidationPerformed)
  }

  protected async onLiquidationEnded(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ agentVault ] = logArgs
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationEnded = new LiquidationEnded(evmLog, agentVaultEntity)
    em.persist(liquidationEnded)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // dangerous events

  protected async onRedemptionPaymentIncomplete(em: EntityManager, evmLog: EvmLog, logArgs: EventArgs): Promise<void> {
    const [ redeemer, remainingLots ] = logArgs
    const redemptionRequestIncomplete = new RedemptionRequestIncomplete(evmLog, redeemer, remainingLots)
    em.persist(redemptionRequestIncomplete)
  }

}
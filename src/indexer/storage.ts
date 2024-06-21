import { EvmLog } from "../database/entities/logs"
import { AgentVault } from "../database/entities/agent"
import { AgentVaultSettings } from "../database/entities/state/agent"
import {
  CollateralReservationDeleted,
  CollateralReserved, MintingExecuted,
  MintingPaymentDefault
} from "../database/entities/events/minting"
import {
  RedemptionRequested, RedemptionPerformed, RedemptionDefault,
  RedemptionPaymentFailed, RedemptionPaymentBlocked, RedemptionRejected
} from "../database/entities/events/redemption"
import {
  FullLiquidationStarted, LiquidationEnded, LiquidationPerformed, LiquidationStarted
} from "../database/entities/events/liquidation"
import {
  AgentSettingChanged, RedemptionRequestIncomplete
} from "../database/entities/events/tracking"
import {
  AGENT_VAULT_CREATED, AGENT_SETTING_CHANGED,
  COLLATERAL_RESERVED, MINTING_EXECUTED, MINTING_PAYMENT_DEFAULT, COLLATERAL_RESERVATION_DELETED,
  REDEMPTION_REQUESTED, REDEMPTION_PERFORMED, REDEMPTION_DEFAULT,
  REDEMPTION_PAYMENT_BLOCKED, REDEMPTION_PAYMENT_FAILED, REDEMPTION_REJECTED,
  LIQUIDATION_STARTED, LIQUIDATION_PERFORMED, LIQUIDATION_ENDED,
  REDEMPTION_REQUEST_INCOMPLETE,
  FULL_LIQUIDATION_STARTED
} from "../constants"
import type { Log, LogDescription } from "ethers"
import type { EntityManager } from "@mikro-orm/knex"
import type { ORM } from "../database/interface"


export abstract class EventStorage {

  async storeLogAndProcessEvent(orm: ORM, log: Log, logDescription: LogDescription, logTimestamp: number): Promise<void> {
    await orm.em.fork().transactional(async (em) => {
      const evmLog = this.logToEntity(log, logDescription.name, logTimestamp)
      em.persist(evmLog)
      await this.storeEvent(em, evmLog, logDescription)
    })
  }

  protected async storeEvent(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    switch (logDescription.name) {
      case AGENT_VAULT_CREATED: {
        await this.handleAgentVaultCreated(em, evmLog, logDescription)
        break
      } case AGENT_SETTING_CHANGED: {
        await this.handleAgentSettingChanged(em, evmLog, logDescription)
        break
      } case COLLATERAL_RESERVED: {
        await this.storeCollateralReserved(em, evmLog, logDescription)
        break
      } case MINTING_EXECUTED: {
        await this.storeMintingExecuted(em, evmLog, logDescription)
        break
      } case MINTING_PAYMENT_DEFAULT: {
        await this.storeMintingPaymentDefault(em, evmLog, logDescription)
        break
      } case COLLATERAL_RESERVATION_DELETED: {
        await this.storeCollateralReservationDeleted(em, evmLog, logDescription)
        break
      } case REDEMPTION_REQUESTED: {
        await this.storeRedemptionRequested(em, evmLog, logDescription)
        break
      } case REDEMPTION_PERFORMED: {
        await this.storeRedemptionPerformed(em, evmLog, logDescription)
        break
      } case REDEMPTION_DEFAULT: {
        await this.storeRedemptionDefault(em, evmLog, logDescription)
        break
      } case REDEMPTION_PAYMENT_BLOCKED: {
        await this.storeRedemptionPaymentBlocked(em, evmLog, logDescription)
        break
      } case REDEMPTION_PAYMENT_FAILED: {
        await this.storeRedemptionPaymentFailed(em, evmLog, logDescription)
        break
      } case REDEMPTION_REJECTED: {
        await this.storeRedemptionRejected(em, evmLog, logDescription)
        break
      } case REDEMPTION_REQUEST_INCOMPLETE: {
        await this.storeRedemptionPaymentIncomplete(em, evmLog, logDescription)
        break
      } case LIQUIDATION_STARTED: {
        await this.storeLiquidationStarted(em, evmLog, logDescription)
        break
      } case LIQUIDATION_PERFORMED: {
        await this.storeLiquidationPerformed(em, evmLog, logDescription)
        break
      } case FULL_LIQUIDATION_STARTED: {
        await this.storeFullLiquidationStarted(em, evmLog, logDescription)
        break
      } case LIQUIDATION_ENDED: {
        await this.storeLiquidationEnded(em, evmLog, logDescription)
        break
      } default: {
        break
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // agent

  protected async handleAgentVaultCreated(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [
      owner, agentVault, collateralPool, underlyingAddress, vaultCollateralToken,
      feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS, mintingPoolCollateralRatioBIPS,
      buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS, poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    ] = logDescription.args
    const agentVaultEntity = new AgentVault(agentVault, underlyingAddress, collateralPool, owner)
    const agentVaultSettings = new AgentVaultSettings(
      agentVaultEntity, vaultCollateralToken, feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS,
      mintingPoolCollateralRatioBIPS, buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS,
      poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    )
    em.persist([agentVaultEntity, agentVaultSettings])
  }

  protected async handleAgentSettingChanged(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ agentVault, name, value ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const agentSettingChanged = new AgentSettingChanged(evmLog, agentVaultEntity, name, value)
    const agentSettings = await em.findOneOrFail(AgentVaultSettings, { agentVault: agentVaultEntity })
    this.applyAgentSettingChange(agentSettings, name, value)
    em.persist([agentSettingChanged, agentSettings])
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

  protected async storeCollateralReserved(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [
      agentVault, minter, collateralReservationId, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const collateralReserved = new CollateralReserved(evmLog,
      collateralReservationId, agentVaultEntity, minter, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    )
    em.persist(collateralReserved)
  }

  protected async storeMintingExecuted(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ , collateralReservationId,,, poolFeeUBA ] = logDescription.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingExecuted = new MintingExecuted(evmLog, collateralReserved, poolFeeUBA)
    em.persist(mintingExecuted)
  }

  protected async storeMintingPaymentDefault(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, collateralReservationId, ] = logDescription.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingPaymentDefault = new MintingPaymentDefault(evmLog, collateralReserved)
    em.persist(mintingPaymentDefault)
  }

  protected async storeCollateralReservationDeleted(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, collateralReservationId, ] = logDescription.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const collateralReservationDeleted = new CollateralReservationDeleted(evmLog, collateralReserved)
    em.persist(collateralReservationDeleted)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // redemptions

  protected async storeRedemptionRequested(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [
      agentVault, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const redemptionRequested = new RedemptionRequested(evmLog,
      agentVaultEntity, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    )
    em.persist(redemptionRequested)
  }

  protected async storeRedemptionPerformed(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash, spentUnderlyingUBA ] = logDescription.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPerformed = new RedemptionPerformed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
    em.persist(redemptionPerformed)
  }

  protected async storeRedemptionDefault(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, requestId,, redeemedVaultCollateralWei, redeemedPoolCollateralWei ] = logDescription.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionDefault = new RedemptionDefault(evmLog, redemptionRequested, redeemedVaultCollateralWei, redeemedPoolCollateralWei)
    em.persist(redemptionDefault)
  }

  protected async storeRedemptionPaymentBlocked(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash,, spentUnderlyingUBA ] = logDescription.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentBlocked = new RedemptionPaymentBlocked(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
    em.persist(redemptionPaymentBlocked)
  }

  protected async storeRedemptionPaymentFailed(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash, spentUnderlyingUBA, failureReason ] = logDescription.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentFailed = new RedemptionPaymentFailed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA, failureReason)
    em.persist(redemptionPaymentFailed)
  }

  protected async storeRedemptionRejected(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ ,, requestId, ] = logDescription.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionRejected = new RedemptionRejected(evmLog, redemptionRequested)
    em.persist(redemptionRejected)
  }

  //////////////////////////////////////////////////////////////////////////
  // liquidations

  protected async storeLiquidationStarted(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ agentVault, timestamp ] = logDescription.args
    const liquidationStarted = new LiquidationStarted(evmLog, agentVault, timestamp)
    em.persist(liquidationStarted)
  }

  protected async storeFullLiquidationStarted(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ agentVault, timestamp ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationPerformed = new FullLiquidationStarted(evmLog, agentVaultEntity, timestamp)
    em.persist(liquidationPerformed)
  }

  protected async storeLiquidationPerformed(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ agentVault, liquidator, valueUBA ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationPerformed = new LiquidationPerformed(evmLog, agentVaultEntity, liquidator, valueUBA)
    em.persist(liquidationPerformed)
  }

  protected async storeLiquidationEnded(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ agentVault ] = logDescription.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const liquidationEnded = new LiquidationEnded(evmLog, agentVaultEntity)
    em.persist(liquidationEnded)
  }

  //////////////////////////////////////////////////////////////////////////
  // dangerous events

  protected async storeRedemptionPaymentIncomplete(em: EntityManager, evmLog: EvmLog, logDescription: LogDescription): Promise<void> {
    const [ redeemer, remainingLots ] = logDescription.args
    const redemptionRequestIncomplete = new RedemptionRequestIncomplete(evmLog, redeemer, remainingLots)
    em.persist(redemptionRequestIncomplete)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // log

  private logToEntity(log: Log, logName: string, logTimestamp: number): EvmLog {
    return new EvmLog(log.blockNumber, log.transactionIndex, log.index, logName, log.address, log.transactionHash, logTimestamp)
  }

}
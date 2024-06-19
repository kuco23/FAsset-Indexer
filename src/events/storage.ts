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
} from "../database/entities/events/redemptions"
import { RedemptionRequestIncomplete } from "../database/entities/events/misc"
import {
  AGENT_VAULT_CREATED,
  COLLATERAL_RESERVED, MINTING_EXECUTED, MINTING_PAYMENT_DEFAULT, COLLATERAL_RESERVATION_DELETED,
  REDEMPTION_REQUESTED, REDEMPTION_PERFORMED, REDEMPTION_DEFAULT,
  REDEMPTION_PAYMENT_BLOCKED, REDEMPTION_PAYMENT_FAILED, REDEMPTION_REJECTED,
  REDEMPTION_REQUEST_INCOMPLETE
} from "../constants"
import type { LogDescription } from "ethers"
import type { EntityManager } from "@mikro-orm/knex"


export abstract class EventStorage {

  async storeLog(em: EntityManager, log: LogDescription): Promise<void> {
    switch (log.name) {
      case AGENT_VAULT_CREATED: {
        await this.handleAgentVaultCreated(em, log)
        break
      } case COLLATERAL_RESERVED: {
        await this.storeCollateralReserved(em, log)
        break
      } case MINTING_EXECUTED: {
        await this.storeMintingExecuted(em, log)
        break
      } case MINTING_PAYMENT_DEFAULT: {
        await this.storeMintingPaymentDefault(em, log)
        break
      } case COLLATERAL_RESERVATION_DELETED: {
        await this.storeCollateralReservationDeleted(em, log)
        break
      } case REDEMPTION_REQUESTED: {
        await this.storeRedemptionRequested(em, log)
        break
      } case REDEMPTION_PERFORMED: {
        await this.storeRedemptionPerformed(em, log)
        break
      } case REDEMPTION_DEFAULT: {
        await this.storeRedemptionDefault(em, log)
        break
      } case REDEMPTION_PAYMENT_BLOCKED: {
        await this.storeRedemptionPaymentBlocked(em, log)
        break
      } case REDEMPTION_PAYMENT_FAILED: {
        await this.storeRedemptionPaymentFailed(em, log)
        break
      } case REDEMPTION_REJECTED: {
        await this.storeRedemptionRejected(em, log)
        break
      } case REDEMPTION_REQUEST_INCOMPLETE: {
        await this.storeRedemptionPaymentIncomplete(em, log)
        break
      } default: {
        break
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // agent

  protected async handleAgentVaultCreated(em: EntityManager, log: LogDescription): Promise<void> {
    const [
      owner, agentVault, collateralPool, underlyingAddress, vaultCollateralToken,
      feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS, mintingPoolCollateralRatioBIPS,
      buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS, poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    ] = log.args
    const agentVaultEntity = new AgentVault(agentVault, underlyingAddress, collateralPool, owner)
    const agentVaultSettings = new AgentVaultSettings(
      agentVaultEntity, vaultCollateralToken, feeBIPS, poolFeeShareBIPS, mintingVaultCollateralRatioBIPS,
      mintingPoolCollateralRatioBIPS, buyFAssetByAgentFactorBIPS, poolExitCollateralRatioBIPS,
      poolTopupCollateralRatioBIPS, poolTopupTokenPriceFactorBIPS
    )
    await em.persist([agentVaultEntity, agentVaultSettings]).flush()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // mintings

  protected async storeCollateralReserved(em: EntityManager, log: LogDescription): Promise<void> {
    const [
      agentVault, minter, collateralReservationId, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    ] = log.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const collateralReserved = new CollateralReserved(
      collateralReservationId, agentVaultEntity, minter, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentAddress, paymentReference, executor, executorFeeNatWei
    )
    await em.persist(collateralReserved).flush()
  }

  protected async storeMintingExecuted(em: EntityManager, log: LogDescription): Promise<void> {
    const [ , collateralReservationId,,, poolFeeUBA ] = log.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingExecuted = new MintingExecuted(collateralReserved, poolFeeUBA)
    await em.persist(mintingExecuted).flush()
  }

  protected async storeMintingPaymentDefault(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, collateralReservationId, ] = log.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const mintingPaymentDefault = new MintingPaymentDefault(collateralReserved)
    await em.persist(mintingPaymentDefault).flush()
  }

  protected async storeCollateralReservationDeleted(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, collateralReservationId, ] = log.args
    const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
    const collateralReservationDeleted = new CollateralReservationDeleted(collateralReserved)
    await em.persist(collateralReservationDeleted).flush()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // redemptions

  protected async storeRedemptionRequested(em: EntityManager, log: LogDescription): Promise<void> {
    const [
      agentVault, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    ] = log.args
    const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
    const redemptionRequested = new RedemptionRequested(
      agentVaultEntity, redeemer, requestId, paymentAddress, valueUBA, feeUBA,
      firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
      paymentReference, executor, executorFeeNatWei
    )
    await em.persist(redemptionRequested).flush()
  }

  protected async storeRedemptionPerformed(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash, redemptionAmountUBA, spentUnderlyingUBA ] = log.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPerformed = new RedemptionPerformed(redemptionRequested, transactionHash, redemptionAmountUBA, spentUnderlyingUBA)
    await em.persist(redemptionPerformed).flush()
  }

  protected async storeRedemptionDefault(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, requestId,, redeemedVaultCollateralWei, redeemedPoolCollateralWei ] = log.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionDefault = new RedemptionDefault(redemptionRequested, redeemedVaultCollateralWei, redeemedPoolCollateralWei)
    await em.persist(redemptionDefault).flush()
  }

  protected async storeRedemptionPaymentBlocked(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash,, spentUnderlyingUBA ] = log.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentBlocked = new RedemptionPaymentBlocked(redemptionRequested, transactionHash, spentUnderlyingUBA)
    await em.persist(redemptionPaymentBlocked).flush()
  }

  protected async storeRedemptionPaymentFailed(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, requestId, transactionHash, spentUnderlyingUBA, failureReason ] = log.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionPaymentFailed = new RedemptionPaymentFailed(redemptionRequested, transactionHash, spentUnderlyingUBA, failureReason)
    await em.persist(redemptionPaymentFailed).flush()
  }

  protected async storeRedemptionRejected(em: EntityManager, log: LogDescription): Promise<void> {
    const [ ,, requestId, ] = log.args
    const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
    const redemptionRejected = new RedemptionRejected(redemptionRequested)
    await em.persist(redemptionRejected).flush()
  }

  //////////////////////////////////////////////////////////////////////////
  // dangerous events

  protected async storeRedemptionPaymentIncomplete(em: EntityManager, log: LogDescription): Promise<void> {
    const [ redeemer, remainingLots ] = log.args
    const redemptionRequestIncomplete = new RedemptionRequestIncomplete(redeemer, remainingLots)
    await em.persist(redemptionRequestIncomplete).flush()
  }

}
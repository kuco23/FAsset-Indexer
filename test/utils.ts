import { EntityManager } from "@mikro-orm/knex"
import { EvmLog } from "../src/database/entities/logs"
import { AgentManager, AgentOwner, AgentVault } from "../src/database/entities/agent"
import { AgentFixture, AgentManagerFixture } from "./fixtures/agent"
import {
  CollateralReservationDeleted, CollateralReserved, MintingExecuted, MintingPaymentDefault
} from "../src/database/entities/events/minting"
import type {
  CollateralReservedFixture, MintingPaymentDefaultFixture,
  CollateralReservationDeletedFixture, MintingExecutedFixture
} from "./fixtures/minting"
import type { ORM } from "../src/database/interface"
import { RedemptionDefaultFixture, RedemptionPaymentBlockedFixture, RedemptionPaymentFailedFixture, RedemptionPerformedFixture, RedemptionRejectedFixture, RedemptionRequestedFixture } from "./fixtures/redemption"
import { RedemptionDefault, RedemptionPaymentBlocked, RedemptionPaymentFailed, RedemptionPerformed, RedemptionRejected, RedemptionRequested } from "../src/database/entities/events/redemption"
import { LiquidationStartedFixture } from "./fixtures/liquidation"
import { LiquidationStarted } from "../src/database/entities/events/liquidation"


export function logFixtureToEntity(log: any): EvmLog {
  const { blockNumber, transactionIndex, logIndex, name, address, transaction, timestamp } = log
  return new EvmLog(blockNumber, transactionIndex, logIndex, name, address, transaction, timestamp)
}

export async function storeAgentFixture(orm: ORM, fixture: AgentFixture) {
  await orm.em.transactional(async (em) => {
    for (const agentManager of fixture) {
      em.persist(agentManagerFixtureToEntity(agentManager))
    }
  })
}

export function agentManagerFixtureToEntity(fixture: AgentManagerFixture): AgentManager {
  const agentManager = new AgentManager(fixture.address)
  for (const agentFixture of fixture.agents) {
    const agentOwner = new AgentOwner(agentFixture.address, agentManager)
    agentManager.agents.add(agentOwner)
    for (const vaultFixture of agentFixture.vaults) {
      agentOwner.vaults.add(new AgentVault(vaultFixture.address, vaultFixture.underlyingAddress, vaultFixture.collateralPool, agentOwner, false))
    }
  }
  return agentManager
}

export async function collateralReservedFixtureToEntity(
  em: EntityManager, fixture: CollateralReservedFixture, evmLog: EvmLog
): Promise<CollateralReserved> {
  const agentVault = await em.findOneOrFail(AgentVault, { address: fixture.agentVault })
  const { collateralReservationId, minter, valueUBA, firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
    paymentAddress, paymentReference, executor, executorFeeNatWei, feeUBA } = fixture
  return new CollateralReserved(evmLog, collateralReservationId, agentVault, minter, valueUBA, feeUBA, firstUnderlyingBlock,
    lastUnderlyingBlock, lastUnderlyingTimestamp, paymentAddress, paymentReference, executor, executorFeeNatWei)
}

export async function mintingExecutedFixtureToEntity(
  em: EntityManager, fixture: MintingExecutedFixture, evmLog: EvmLog
): Promise<MintingExecuted> {
  const { collateralReservationId, poolFeeUBA } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new MintingExecuted(evmLog, collateralReserved, poolFeeUBA)
}

export async function mintingPaymentDefaultFixtureToEntity(
  em: EntityManager, fixture: MintingPaymentDefaultFixture, evmLog: EvmLog
): Promise<MintingPaymentDefault> {
  const { collateralReservationId } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new MintingPaymentDefault(evmLog, collateralReserved)
}

export async function collateralReservationDeletedFixtureToEntity(
  em: EntityManager, fixture: CollateralReservationDeletedFixture, evmLog: EvmLog
): Promise<CollateralReservationDeleted> {
  const { collateralReservationId } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new CollateralReservationDeleted(evmLog, collateralReserved)
}

export async function redemptionRequestedFixtureToEntity(
  em: EntityManager, fixture: RedemptionRequestedFixture, evmLog: EvmLog
): Promise<RedemptionRequested> {
  const agentVault = await em.findOneOrFail(AgentVault, { address: fixture.agentVault })
  const { requestId, redeemer, paymentAddress, valueUBA, feeUBA, firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
    paymentReference, executor, executorFeeNatWei } = fixture
  return new RedemptionRequested(evmLog, agentVault, redeemer, requestId, paymentAddress, valueUBA, feeUBA, firstUnderlyingBlock,
    lastUnderlyingBlock, lastUnderlyingTimestamp, paymentReference, executor, executorFeeNatWei)
}

export async function redemptionPerformedFixtureToEntity(
  em: EntityManager, fixture: RedemptionPerformedFixture, evmLog: EvmLog
): Promise<RedemptionPerformed> {
  const { requestId, transactionHash, spentUnderlyingUBA } = fixture
  const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
  return new RedemptionPerformed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
}

export async function redemptionPaymentDefaultFixtureToEntity(
  em: EntityManager, fixture: RedemptionDefaultFixture, evmLog: EvmLog
): Promise<RedemptionDefault> {
  const { requestId, redeemedPoolCollateralWei, redeemedVaultCollateralWei } = fixture
  const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
  return new RedemptionDefault(evmLog, redemptionRequested, redeemedVaultCollateralWei, redeemedPoolCollateralWei)
}

export async function redemptionRejectedFixtureToEntity(
  em: EntityManager, fixture: RedemptionRejectedFixture, emvLog: EvmLog,
): Promise<RedemptionRejected> {
  const { requestId } = fixture
  const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
  return new RedemptionRejected(emvLog, redemptionRequested)
}

export async function redemptionPaymentBlockedFixtureToEntity(
  em: EntityManager, fixture: RedemptionPaymentBlockedFixture, evmLog: EvmLog
): Promise<RedemptionPaymentBlocked> {
  const { requestId, transactionHash, spentUnderlyingUBA } = fixture
  const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
  return new RedemptionPaymentBlocked(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA)
}

export async function redemptionPaymentFailedFixtureToEntity(
  em: EntityManager, fixture: RedemptionPaymentFailedFixture, evmLog: EvmLog
): Promise<RedemptionPaymentFailed> {
  const { requestId, failureReason, spentUnderlyingUBA, transactionHash } = fixture
  const redemptionRequested = await em.findOneOrFail(RedemptionRequested, { requestId: requestId })
  return new RedemptionPaymentFailed(evmLog, redemptionRequested, transactionHash, spentUnderlyingUBA, failureReason)
}

export async function liquidationStartedFixtureToEntity(
  em: EntityManager, fixture: LiquidationStartedFixture, evmLog: EvmLog
): Promise<LiquidationStarted> {
  const { agentVault, timestamp } = fixture
  const agentVaultEntity = await em.findOneOrFail(AgentVault, { address: agentVault })
  return new LiquidationStarted(evmLog, agentVaultEntity, timestamp)
}
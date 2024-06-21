import { EvmLog } from "../src/database/entities/logs"
import { AgentManager, AgentOwner, AgentVault } from "../src/database/entities/agent"
import { AgentFixture, AgentManagerFixture } from "./fixtures/agent"
import type { ORM } from "../src/database/interface"
import { CollateralReservationDeleted, CollateralReserved, MintingExecuted, MintingPaymentDefault } from "../src/database/entities/events/minting"
import { CollateralReservedFixture } from "./fixtures/minting"
import { EntityManager } from "@mikro-orm/knex"



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
      agentOwner.vaults.add(new AgentVault(vaultFixture.address, vaultFixture.underlyingAddress, vaultFixture.collateralPool, agentOwner))
    }
  }
  return agentManager
}

export async function collateralReservedFixtureToEntity(em: EntityManager, fixture: CollateralReservedFixture, evmLog: EvmLog): Promise<CollateralReserved> {
  const agentVault = await em.findOneOrFail(AgentVault, { address: fixture.agentVault })
  const { collateralReservationId, minter, valueUBA, firstUnderlyingBlock, lastUnderlyingBlock, lastUnderlyingTimestamp,
    paymentAddress, paymentReference, executor, executorFeeNatWei, feeUBA } = fixture
  return new CollateralReserved(evmLog, collateralReservationId, agentVault, minter, valueUBA, feeUBA, firstUnderlyingBlock,
    lastUnderlyingBlock, lastUnderlyingTimestamp, paymentAddress, paymentReference, executor, executorFeeNatWei)
}

export async function mintingExecutedFixtureToEntity(em: EntityManager, fixture: any, evmLog: EvmLog): Promise<MintingExecuted> {
  const { collateralReservationId, poolFeeUBA } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new MintingExecuted(evmLog, collateralReserved, poolFeeUBA)
}

export async function mintingPaymentDefaultFixtureToEntity(em: EntityManager, fixture: any, evmLog: EvmLog): Promise<MintingPaymentDefault> {
  const { collateralReservationId } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new MintingPaymentDefault(evmLog, collateralReserved)
}

export async function collateralReservationDeletedFixtureToEntity(em: EntityManager, fixture: any, evmLog: EvmLog): Promise<CollateralReservationDeleted> {
  const { collateralReservationId } = fixture
  const collateralReserved = await em.findOneOrFail(CollateralReserved, { collateralReservationId: collateralReservationId })
  return new CollateralReservationDeleted(evmLog, collateralReserved)
}
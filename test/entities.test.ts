import { describe, beforeEach, afterEach, it } from "mocha"
import { expect } from "chai"
import { unlink } from "fs"
import { resolve } from "path"
import { createOrm } from "../src/database/utils"
import { AgentManager, AgentOwner, AgentVault } from "../src/database/entities/agent"
import {
  storeAgentFixture, logFixtureToEntity, collateralReservedFixtureToEntity,
  mintingExecutedFixtureToEntity, mintingPaymentDefaultFixtureToEntity,
  collateralReservationDeletedFixtureToEntity
} from "./utils"
import { CONFIG } from "./fixtures/config"
import { AGENT_FIXTURE } from "./fixtures/agent"
import { MINTING_FIXTURE } from "./fixtures/minting"
import {
  CollateralReservationDeleted, CollateralReserved,
  MintingExecuted, MintingPaymentDefault
} from "../src/database/entities/events/minting"
import { randomLog } from "./fixtures/utils"
import {
  COLLATERAL_RESERVATION_DELETED, COLLATERAL_RESERVED,
  MINTING_EXECUTED, MINTING_PAYMENT_DEFAULT
} from "../src/constants"
import type { ORM } from "../src/database/interface"


describe("ORM: Agent", () => {
  let orm: ORM

  beforeEach(async () => {
    orm = await createOrm(CONFIG.database, "safe")
  })

  afterEach(async () => {
    await orm.close()
    unlink(resolve(CONFIG.database.dbName!), () => {})
  })

  it("should test storing agent managers/owners/vaults from fixtures", async () => {
    await storeAgentFixture(orm, AGENT_FIXTURE)
    const em = orm.em.fork()
    for (const agentManagerFixture of AGENT_FIXTURE) {
      const agentManager = await em.findOne(AgentManager, { address: agentManagerFixture.address })
      expect(agentManager).to.exist
      expect(agentManager!.address).to.equal(agentManagerFixture.address)
      await agentManager!.agents.load()
      // check if agent manager entity has agent owner and vaults stored
      for (const agentFixture of agentManagerFixture.agents) {
        const agentOwner = agentManager!.agents.find(agent => agent.address === agentFixture.address)
        expect(agentOwner).to.exist
        expect(agentOwner!.address).to.equal(agentFixture.address)
        await agentOwner!.vaults.load()
        for (const vaultFixture of agentFixture.vaults) {
          const agentVault = agentOwner!.vaults.find(vault => vault.address === vaultFixture.address)
          expect(agentVault).to.exist
          expect(agentVault!.address).to.equal(vaultFixture.address)
          expect(agentVault!.underlyingAddress).to.equal(vaultFixture.underlyingAddress)
          expect(agentVault!.collateralPool).to.equal(vaultFixture.collateralPool)
        }
      }
      // check if vaults and owners are stored in the database
      for (const agentFixture of agentManager!.agents) {
        const agentOwner = await em.findOne(AgentOwner, { address: agentFixture.address })
        expect(agentOwner).to.exist
        expect(agentOwner!.address).to.equal(agentFixture.address)
        for (const vaultFixture of agentFixture.vaults) {
          const agentVault = await em.findOne(AgentVault, { address: vaultFixture.address })
          expect(agentVault).to.exist
          expect(agentVault!.address).to.equal(vaultFixture.address)
          expect(agentVault!.underlyingAddress).to.equal(vaultFixture.underlyingAddress)
          expect(agentVault!.collateralPool).to.equal(vaultFixture.collateralPool)
        }
      }
    }
  })

  it("should test storing mintings from fixture", async () => {
    await storeAgentFixture(orm, AGENT_FIXTURE)
    await orm.em.transactional(async (em) => {
      for (const collateralReservedFixture of MINTING_FIXTURE.COLLATERAL_RESERVED) {
        const evmLog = logFixtureToEntity(randomLog(COLLATERAL_RESERVED))
        const collateralReserved = await collateralReservedFixtureToEntity(em, collateralReservedFixture, evmLog)
        em.persist(collateralReserved)
      }
    })
    await orm.em.transactional(async (em) => {
      for (const mintingExecutedFixture of MINTING_FIXTURE.MINTING_EXECUTED) {
        const evmLog = logFixtureToEntity(randomLog(MINTING_EXECUTED))
        const mintingExecuted = await mintingExecutedFixtureToEntity(em, mintingExecutedFixture, evmLog)
        em.persist(mintingExecuted)
      }
    })
    await orm.em.transactional(async (em) => {
      for (const mintingPaymentDefaultFixture of MINTING_FIXTURE.MINTING_PAYMENT_DEFAULT) {
        const evmLog = logFixtureToEntity(randomLog(MINTING_PAYMENT_DEFAULT))
        const collateralReserved = await mintingPaymentDefaultFixtureToEntity(em, mintingPaymentDefaultFixture, evmLog)
        em.persist(collateralReserved)
      }
    })
    await orm.em.transactional(async (em) => {
      for (const mintingReservationDeleted of MINTING_FIXTURE.COLLATERAL_RESERVATION_DELETED) {
        const evmLog = logFixtureToEntity(randomLog(COLLATERAL_RESERVATION_DELETED))
        const collateralReserved = await collateralReservationDeletedFixtureToEntity(em, mintingReservationDeleted, evmLog)
        em.persist(collateralReserved)
      }
    })
    for (const collateralReservedFixture of MINTING_FIXTURE.COLLATERAL_RESERVED) {
      const collateralReserved = await orm.em.fork().findOne(CollateralReserved,
        { collateralReservationId: collateralReservedFixture.collateralReservationId })
      expect(collateralReserved).to.exist
      console.log(collateralReserved!.agentVault)
      expect(collateralReserved!.collateralReservationId).to.equal(collateralReservedFixture.collateralReservationId)
      expect((await collateralReserved!.agentVault.loadOrFail()).address).to.equal(collateralReservedFixture.agentVault)
      expect(collateralReserved!.minter).to.equal(collateralReservedFixture.minter)
      expect(collateralReserved!.valueUBA).to.equal(collateralReservedFixture.valueUBA)
      expect(collateralReserved!.feeUBA).to.equal(collateralReservedFixture.feeUBA)
      expect(collateralReserved!.firstUnderlyingBlock).to.equal(collateralReservedFixture.firstUnderlyingBlock)
      expect(collateralReserved!.lastUnderlyingBlock).to.equal(collateralReservedFixture.lastUnderlyingBlock)
      expect(collateralReserved!.lastUnderlyingTimestamp).to.equal(collateralReservedFixture.lastUnderlyingTimestamp)
      expect(collateralReserved!.paymentAddress).to.equal(collateralReservedFixture.paymentAddress)
      expect(collateralReserved!.paymentReference).to.equal(collateralReservedFixture.paymentReference)
      expect(collateralReserved!.executor).to.equal(collateralReservedFixture.executor)
      expect(collateralReserved!.executorFeeNatWei).to.equal(collateralReservedFixture.executorFeeNatWei)
    }
    for (const mintingExecutedFixture of MINTING_FIXTURE.MINTING_EXECUTED) {
      const { collateralReservationId } = mintingExecutedFixture
      const mintingExecuted = await orm.em.fork().findOneOrFail(MintingExecuted, {
        collateralReserved: { collateralReservationId: collateralReservationId }})
      expect(mintingExecuted).to.exist
      expect(mintingExecuted!.poolFeeUBA).to.equal(mintingExecutedFixture.poolFeeUBA)
      expect((await mintingExecuted!.collateralReserved.loadOrFail()).collateralReservationId)
        .to.equal(collateralReservationId)
    }
    for (const mintingPaymentDefaultFixture of MINTING_FIXTURE.MINTING_PAYMENT_DEFAULT) {
      const { collateralReservationId } = mintingPaymentDefaultFixture
      const mintingPaymentDefault = await orm.em.fork().findOneOrFail(MintingPaymentDefault, {
        collateralReserved: { collateralReservationId: collateralReservationId }})
      expect(mintingPaymentDefault).to.exist
      expect((await mintingPaymentDefault!.collateralReserved.loadOrFail()).collateralReservationId)
        .to.equal(collateralReservationId)
    }
    for (const collateralReservationDeletedFixture of MINTING_FIXTURE.COLLATERAL_RESERVATION_DELETED) {
      const { collateralReservationId } = collateralReservationDeletedFixture
      const collateralReservationDeleted = await orm.em.fork().findOneOrFail(CollateralReservationDeleted, {
        collateralReserved: { collateralReservationId: collateralReservationId }})
      expect(collateralReservationDeleted).to.exist
      expect((await collateralReservationDeleted!.collateralReserved.loadOrFail()).collateralReservationId)
        .to.equal(collateralReservationId)
    }
  })
})
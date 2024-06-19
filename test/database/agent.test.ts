import { describe, beforeEach, afterEach, it } from "mocha"
import { expect } from "chai"
import { AgentManager, Agent, AgentVault } from "../../src/database/entities/agent"
import { createOrm } from "../../src/database/utils"
import { config, ASSET_MANAGER } from "./fixtures"
import type { ORM } from "../../src/database/interface"


describe("ORM: Agent", () => {
  let orm: ORM

  beforeEach(async () => {
    orm = await createOrm(config.database, "safe")
  })

  afterEach(async () => {
    await orm.close()
  })

  it("should create an agent manager, agent owner, and agent vault", async () => {
    const vault = ASSET_MANAGER.agents[0].vaults[0]
    await orm.em.transactional(async (em) => {
      const agentManager = new AgentManager(ASSET_MANAGER.address)
      const agentOwner = new Agent(ASSET_MANAGER.agents[0].address, agentManager)
      const agentVault = new AgentVault(vault.address, vault.underlyingAddress, vault.collateralPool, agentOwner)
      await em.persistAndFlush([agentManager, agentOwner, agentVault])
    })
    const em = orm.em.fork()
    const agentManager = await em.findOne(AgentManager, { address: ASSET_MANAGER.address })
    expect(agentManager).to.exist
    expect(agentManager!.address).to.equal(ASSET_MANAGER.address)
    await agentManager!.agents.load()
    expect(agentManager!.agents.length).to.equal(1)
    expect(agentManager!.agents[0].address).to.equal(ASSET_MANAGER.agents[0].address)
    const agentOwner = await em.findOne(Agent, { address: ASSET_MANAGER.agents[0].address })
    expect(agentOwner).to.exist
    expect(agentOwner!.address).to.equal(ASSET_MANAGER.agents[0].address)
    await agentOwner!.vaults.load()
    expect(agentOwner!.vaults.length).to.equal(1)
    expect(agentOwner!.vaults[0].address).to.equal(vault.address)
    const agentVault = await em.findOne(AgentVault, { address: vault.address })
    expect(agentVault).to.exist
    expect(agentVault!.address).to.equal(vault.address)
    expect(agentVault!.underlyingAddress).to.equal(vault.underlyingAddress)
    expect(agentVault!.collateralPool).to.equal(vault.collateralPool)
  })
})
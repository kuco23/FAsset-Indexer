import { AGENT_FIXTURE } from "./agent"
import { randomNativeAddress } from "./utils"

const LIQUIDATION_STARTED = {
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[0].address,
  timestamp: Date.now()
}

const LIQUIDATION_PERFORMED = {
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[0].address,
  liquidator: randomNativeAddress(),
  valueUBA: BigInt(1e19)
}

const LIQUIDATION_ENDED = {
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[0].address
}

const FULL_LIQUIDATION_STARTED = {
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[0].address,
  timestamp: Date.now()
}

export const LIQUIDATION_FIXTURE = {
  LIQUIDATION_STARTED: [
    LIQUIDATION_STARTED
  ],
  LIQUIDATION_PERFORMED: [
    LIQUIDATION_PERFORMED
  ],
  LIQUIDATION_ENDED: [
    LIQUIDATION_ENDED
  ],
  FULL_LIQUIDATION_STARTED: [
    FULL_LIQUIDATION_STARTED
  ]
}

export type LiquidationFixture = typeof LIQUIDATION_FIXTURE
export type LiquidationStartedFixture = typeof LIQUIDATION_STARTED
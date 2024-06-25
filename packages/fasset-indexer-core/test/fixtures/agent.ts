import { randomNativeAddress, randomUnderlyingAddress } from "./utils"

export interface AgentManagerFixture {
  address: string
  agents: AgentOwnerFixture[]
}

interface AgentOwnerFixture {
  address: string
  vaults: AgentVaultFixture[]
}

interface AgentVaultFixture {
  address: string
  collateralPool: string
  underlyingAddress: string
}

const AGENT_MANAGER: AgentManagerFixture = {
  address: randomNativeAddress(),
  agents: Array(2).fill(0).map(() => ({
    address: randomNativeAddress(),
    vaults: Array(3).fill(0).map(() => ({
      address: randomNativeAddress(),
      collateralPool: randomNativeAddress(),
      underlyingAddress: randomUnderlyingAddress()
    }))
  }))
}

export type AgentFixture = AgentManagerFixture[]
export const AGENT_FIXTURE: AgentFixture = [
  AGENT_MANAGER
]
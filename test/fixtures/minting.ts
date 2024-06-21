import { AGENT_FIXTURE } from "./agent"
import { randomNativeAddress, randomUnderlyingAddress, randomBytes32 } from "./utils"


const COLLATERAL_RESERVED_1 = {
  collateralReservationId: 1,
  minter: randomNativeAddress(),
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[0].address,
  valueUBA: BigInt(1e18),
  feeUBA: BigInt(1e16),
  firstUnderlyingBlock: 118419,
  lastUnderlyingBlock: 1313440,
  lastUnderlyingTimestamp: 2312411,
  paymentAddress: randomUnderlyingAddress(),
  paymentReference: randomBytes32(),
  executor: randomNativeAddress(),
  executorFeeNatWei: BigInt(1e16)
}

const COLLATERAL_RESERVED_2 = {
  ...COLLATERAL_RESERVED_1,
  collateralReservationId: 2,
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[1].address,
  paymentReference: randomBytes32()
}

const COLLATERAL_RESERVED_3 = {
  ...COLLATERAL_RESERVED_1,
  collateralReservationId: 3,
  agentVault: AGENT_FIXTURE[0].agents[0].vaults[2].address,
  paymentReference: randomBytes32()
}

const MINTING_EXECUTED = {
  agentVault: COLLATERAL_RESERVED_1.agentVault,
  collateralReservationId: COLLATERAL_RESERVED_1.collateralReservationId,
  mintedAmountUBA: COLLATERAL_RESERVED_1.valueUBA,
  agentFeeUBA: COLLATERAL_RESERVED_1.feeUBA,
  poolFeeUBA: BigInt(1e15)
}

const MINTING_PAYMENT_DEFAULT = {
  agentVault: COLLATERAL_RESERVED_2.agentVault,
  collateralReservationId: COLLATERAL_RESERVED_2.collateralReservationId,
  minter: COLLATERAL_RESERVED_2.minter,
  reservedAmountUBA: COLLATERAL_RESERVED_2.valueUBA
}

const COLLATERAL_RESERVATION_DELETED = {
  agentVault: COLLATERAL_RESERVED_3.agentVault,
  collateralReservationId: COLLATERAL_RESERVED_3.collateralReservationId,
  minter: COLLATERAL_RESERVED_3.minter,
  reservedAmountUBA: COLLATERAL_RESERVED_3.valueUBA
}

export const MINTING_FIXTURE = {
  COLLATERAL_RESERVED: [
    COLLATERAL_RESERVED_1,
    COLLATERAL_RESERVED_2,
    COLLATERAL_RESERVED_3
  ],
  MINTING_EXECUTED: [
    MINTING_EXECUTED
  ],
  MINTING_PAYMENT_DEFAULT: [
    MINTING_PAYMENT_DEFAULT
  ],
  COLLATERAL_RESERVATION_DELETED: [
    COLLATERAL_RESERVATION_DELETED
  ]
}

export type CollateralReservedFixture = typeof COLLATERAL_RESERVED_1
export type MintingExecutedFixture = typeof MINTING_EXECUTED
export type MintingPaymentDefaultFixture = typeof MINTING_PAYMENT_DEFAULT
export type MintingReservationDeletedFixture = typeof COLLATERAL_RESERVATION_DELETED
export type MintingFixture = typeof MINTING_FIXTURE
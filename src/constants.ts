// db variable names
export const FIRST_UNHANDLED_EVENT_BLOCK_KEY = "firstUnhandledEventBlock"

// metadata
export const ADDRESS_LENGTH = 42
export const BYTES32_LENGTH = 66

// event scrape data
export const LOG_FETCH_SIZE = 30
export const LOG_FETCH_SLEEP_MS = 200
export const LOG_FETCH_RETRY_LIMIT = 100

// event names
export const AGENT_VAULT_CREATED = "AgentVaultCreated"
export const AGENT_SETTING_CHANGED = "AgentSettingChanged"
export const COLLATERAL_RESERVED = "CollateralReserved"
export const MINTING_EXECUTED = "MintingExecuted"
export const MINTING_PAYMENT_DEFAULT = "MintingPaymentDefault"
export const COLLATERAL_RESERVATION_DELETED = "CollateralReservationDeleted"
export const REDEMPTION_REQUESTED = "RedemptionRequested"
export const REDEMPTION_PERFORMED = "RedemptionPerformed"
export const REDEMPTION_DEFAULT = "RedemptionDefault"
export const REDEMPTION_PAYMENT_BLOCKED = "RedemptionPaymentBlocked"
export const REDEMPTION_PAYMENT_FAILED = "RedemptionPaymentFailed"
export const REDEMPTION_REJECTED = "RedemptionRejected"
export const REDEMPTION_REQUEST_INCOMPLETE = "RedemptionRequestIncomplete"
export const LIQUIDATION_STARTED = "LiquidationStarted"
export const FULL_LIQUIDATION_STARTED = "FullLiquidationStarted"
export const LIQUIDATION_PERFORMED = "LiquidationPerformed"
export const LIQUIDATION_ENDED = "LiquidationEnded"
export const COLLATERAL_TYPE_ADDED = "CollateralTypeAdded"
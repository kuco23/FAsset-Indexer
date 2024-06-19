// db variable names
export const FIRST_UNHANDLED_EVENT_BLOCK_KEY = "firstUnhandledEventBlock"

// event names
// agent
export const AGENT_VAULT_CREATED = "AgentVaultCreated"
export const AGENT_SETTINGS_CHANGED = "AgentSettingChanged"
// minting
export const COLLATERAL_RESERVED = "CollateralReserved"
export const MINTING_EXECUTED = "MintingExecuted"
export const MINTING_PAYMENT_DEFAULT = "MintingPaymentDefault"
export const COLLATERAL_RESERVATION_DELETED = "CollateralReservationDeleted"
// redemption
export const REDEMPTION_REQUESTED = "RedemptionRequested"
export const REDEMPTION_PERFORMED = "RedemptionPerformed"
export const REDEMPTION_DEFAULT = "RedemptionDefault"
export const REDEMPTION_PAYMENT_BLOCKED = "RedemptionPaymentBlocked"
export const REDEMPTION_PAYMENT_FAILED = "RedemptionPaymentFailed"
export const REDEMPTION_REJECTED = "RedemptionRejected"
export const REDEMPTION_REQUEST_INCOMPLETE = "RedemptionRequestIncomplete"

// metadata
export const ADDRESS_LENGTH = 42
export const BYTES32_LENGTH = 66

// event scrape data
export const LOG_FETCH_SIZE = 30
export const LOG_FETCH_SLEEP_MS = 200
export const LOG_FETCH_RETRY_LIMIT = 100
import { defineConfig } from "@mikro-orm/core"
import { SqliteDriver } from "@mikro-orm/sqlite"
import { Var } from "./entities/state/var"
import { EvmLog, EvmLogTopic } from "./entities/logs"
import { AgentManager, Agent, AgentVault } from "./entities/agent"
import {
  CollateralReserved, MintingExecuted,
  MintingPaymentDefault, CollateralReservationDeleted
} from "../database/entities/events/minting"
import {
  RedemptionRequested, RedemptionPerformed, RedemptionDefault,
  RedemptionPaymentFailed, RedemptionPaymentBlocked, RedemptionRejected
} from "../database/entities/events/redemptions"
import { RedemptionRequestIncomplete } from "../database/entities/events/misc"
import type { Options } from "@mikro-orm/core"
import type { AbstractSqlDriver } from "@mikro-orm/knex"


export const ORM_OPTIONS: Options<AbstractSqlDriver> = defineConfig({
  entities: [
    Var, EvmLog, EvmLogTopic,
    AgentManager, Agent, AgentVault,
    CollateralReserved, MintingExecuted, MintingPaymentDefault, CollateralReservationDeleted,
    RedemptionRequested, RedemptionPerformed, RedemptionDefault,
    RedemptionPaymentFailed, RedemptionPaymentBlocked, RedemptionRejected,
    RedemptionRequestIncomplete
  ],
  driver: SqliteDriver,
  dbName: "fasset-open-beta-monitor.db",
  debug: false
})

export default ORM_OPTIONS
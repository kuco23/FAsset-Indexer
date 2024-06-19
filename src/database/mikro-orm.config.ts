import { defineConfig } from "@mikro-orm/core"
import { SqliteDriver } from "@mikro-orm/sqlite"
import { EvmLog, EvmLogTopic, Var } from "./entities/logs"
import { AgentManager, Agent, AgentVault } from "./entities/agent"
import { CollateralReserved, MintingExecuted, MintingPaymentDefault, CollateralReservationDeleted } from "./entities/minting"
import { RedemptionRequested, RedemptionPerformed } from "./entities/redemptions"
import type { Options } from "@mikro-orm/core"
import type { AbstractSqlDriver } from "@mikro-orm/knex"


export const ORM_OPTIONS: Options<AbstractSqlDriver> = defineConfig({
  entities: [
    EvmLog, EvmLogTopic, Var,
    AgentManager, Agent, AgentVault,
    CollateralReserved, MintingExecuted, MintingPaymentDefault, CollateralReservationDeleted,
    RedemptionRequested, RedemptionPerformed
  ],
  dbName: "fasset-open-beta-monitor.db",
  debug: false,
  driver: SqliteDriver
})

export default ORM_OPTIONS
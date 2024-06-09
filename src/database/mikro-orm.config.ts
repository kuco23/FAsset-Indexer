import { defineConfig } from "@mikro-orm/core"
import { SqliteDriver } from "@mikro-orm/sqlite"
import { EvmEvent, EvmEventTopic } from "./entities"
import type { Options } from "@mikro-orm/core"
import type { AbstractSqlDriver } from "@mikro-orm/knex"


export const ORM_OPTIONS: Options<AbstractSqlDriver> = defineConfig({
  entities: [EvmEvent, EvmEventTopic],
  dbName: "fasset-open-beta-monitor.db",
  debug: false,
  driver: SqliteDriver
})

export default ORM_OPTIONS
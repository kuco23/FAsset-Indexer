import "dotenv/config"
import { resolve } from "path"
import { SqliteDriver } from '@mikro-orm/sqlite'
import _CONTRACTS from '../chain/coston.json'
import { abi as AssetManagerAbi } from '../chain/artifacts/AssetManager.json'
import { abi as AMEAbi } from '../chain/artifacts/AMEvents.json'
import type { OrmOptions } from './database/interface'
import { defineConfig } from "@mikro-orm/core"


export interface IConfig {
  rpcUrl: string
  apiKey?: string
  contracts: typeof _CONTRACTS
  abis: {
    events: typeof AMEAbi
    assetManager: typeof AssetManagerAbi
  },
  database: OrmOptions,
  ignoreEvents?: string[]
}

if (!process.env.DATABASE_PATH === undefined) {
  throw new Error(".env variable `DATABASE_PATH` is required")
}

export const config: IConfig = {
  rpcUrl: "https://coston-api.flare.network/ext/C/rpc",
  apiKey: process.env.FLARE_API_KEY,
  contracts: _CONTRACTS,
  abis: {
    events: AMEAbi,
    assetManager: AssetManagerAbi
  },
  database: defineConfig({
    driver: SqliteDriver,
    dbName: resolve(process.env.DATABASE_PATH!),
    debug: false
  }),
  ignoreEvents: [
    'CurrentUnderlyingBlockUpdated'
  ]
}
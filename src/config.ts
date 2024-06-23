import "dotenv/config"
import { SqliteDriver } from '@mikro-orm/sqlite'
import _CONTRACTS from '../chain/coston.json'
import { abi as AssetManagerAbi } from '../chain/artifacts/AssetManager.json'
import { abi as AMEAbi } from '../chain/artifacts/AMEvents.json'
import type { OrmOptions } from './database/interface'


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

export const config: IConfig = {
  rpcUrl: "https://coston-api.flare.network/ext/C/rpc",
  apiKey: process.env.FLARE_API_KEY,
  contracts: _CONTRACTS,
  abis: {
    events: AMEAbi,
    assetManager: AssetManagerAbi
  },
  database: {
    driver: SqliteDriver,
    dbName: "fasset-open-beta-monitor.db",
    debug: false
  },
  ignoreEvents: [
    'CurrentUnderlyingBlockUpdated'
  ]
}
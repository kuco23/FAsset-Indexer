import { SqliteDriver } from '@mikro-orm/sqlite'
import _CONTRACTS from '../coston.json'
import { abi as AssetManagerAbi } from '../artifacts/AssetManager.json'
import { abi as AMEAbi } from '../artifacts/AMEvents.json'
import type { OrmOptions } from './database/interface'


export interface IConfig {
  rpcUrl: string
  contracts: typeof _CONTRACTS
  abis: {
    events: any
    assetManager: any
  },
  database: OrmOptions
}

export const config: IConfig = {
  rpcUrl: "https://coston-api.flare.network/ext/C/rpc",
  contracts: _CONTRACTS,
  abis: {
    events: AMEAbi,
    assetManager: AssetManagerAbi
  },

  database: {
    driver: SqliteDriver,
    dbName: "fasset-open-beta-monitor.db",
    debug: false
  }
}
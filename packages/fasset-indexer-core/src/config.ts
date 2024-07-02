import "dotenv/config"
import { resolve } from "path"
import { defineConfig } from "@mikro-orm/core"
import { SqliteDriver } from '@mikro-orm/sqlite'
import { PostgreSqlDriver } from "@mikro-orm/postgresql"
import { abi as ASSET_MANAGER_ABI } from '../chain/artifacts/AssetManager.json'
import { abi as ASSET_MANAGER_EVENTS_ABI } from '../chain/artifacts/AMEvents.json'
import CONTRACTS from '../chain/coston.json'
import type { OrmOptions } from './database/interface'


const RPC_URL = "https://coston-api.flare.network/ext/C/rpc"
const IGNORE_EVENTS = [ 'CurrentUnderlyingBlockUpdated' ]

export interface IUserConfig {
  rpcUrl?: string
  apiKey?: string
  dbType: "sqlite" | "postgres"
  dbName: string
  dbHost?: string
  dbPort?: number
  dbUser?: string
  dbPass?: string
}

export interface IConfig {
  rpc: {
    url: string
    apiKey?: string
  }
  contracts: {
    addresses: typeof CONTRACTS,
    abis: {
      events: typeof ASSET_MANAGER_EVENTS_ABI
      assetManager: typeof ASSET_MANAGER_ABI
    }
  }
  db: OrmOptions,
  ignoreEvents?: string[]
}

function getUserConfig(): IUserConfig {
  const dbType = process.env.DB_TYPE
  let dbName = process.env.DB_NAME
  if (dbType !== "sqlite" && dbType !== "postgres") {
    throw new Error("environment variable DB_TYPE needs to be 'sqlite' or 'postgres'")
  }
  if (dbName === undefined) {
    throw new Error("environment variable DB_NAME is required")
  } else if (dbType === "sqlite") {
    dbName = resolve(dbName)
  }
  return {
    rpcUrl: process.env.RPC_URL ?? RPC_URL,
    apiKey: process.env.RPC_API_KEY,
    dbType: dbType,
    dbName: dbName,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT === undefined ? undefined : parseInt(process.env.DB_PORT),
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASSWORD
  }
}

function expandUserConfig(userConfig: IUserConfig): IConfig {
  return {
    rpc: {
      url: RPC_URL,
      apiKey: userConfig.apiKey,
    },
    contracts: {
      addresses: CONTRACTS,
      abis: {
        events: ASSET_MANAGER_EVENTS_ABI,
        assetManager: ASSET_MANAGER_ABI,
      }
    },
    db: defineConfig({
      driver: ((userConfig.dbType === "sqlite") ? SqliteDriver : PostgreSqlDriver) as any,
      dbName: userConfig.dbName,
      host: userConfig.dbHost,
      port: userConfig.dbPort,
      user: userConfig.dbUser,
      password: userConfig.dbPass,
      debug: false
    }),
    ignoreEvents: IGNORE_EVENTS
  }
}

export const config = expandUserConfig(getUserConfig())
import { JsonRpcProvider, Interface, FetchRequest } from "ethers"
import { createOrm, setVar, getVar } from "./database/utils"
import type { IConfig } from "./config"


export class Context {
  provider: JsonRpcProvider

  constructor(public config: IConfig) {
    const connection = new FetchRequest(config.rpcUrl)
    if (config.apiKey !== undefined) {
      connection.setHeader('x-api-key', config.apiKey)
    }
    this.provider = new JsonRpcProvider(connection)
  }

  getContractAddress(name: string): string | undefined {
    for (const contract of this.config.contracts) {
      if (contract.name === name)
        return contract.address
    }
  }

  getEventInterface(): Interface {
    return new Interface(this.config.abis.events)
  }

  async setVar(key: string, value: string) {
    const orm = await createOrm(this.config.database, "safe")
    await setVar(key, value, orm.em.fork())
    await orm.close()
  }

  async getVar(key: string): Promise<string | undefined> {
    const orm = await createOrm(this.config.database, "safe")
    const value = await getVar(key, orm.em.fork())
    await orm.close()
    return value
  }
}
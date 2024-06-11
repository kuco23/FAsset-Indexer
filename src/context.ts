import { JsonRpcProvider, Interface, FetchRequest } from "ethers"
import type { IConfig } from "./config"
import { createOrm } from "./database/utils"
import { Var } from "./database/entities"


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
    const em = orm.em.fork()
    let vr = await em.findOne(Var, { key })
    if (!vr) {
      let vr = new Var(key, value)
      em.persist(vr)
    } else {
      vr.value = value
    }
    await em.flush()
    await orm.close()
  }

  async getVar(key: string): Promise<string | undefined> {
    const orm = await createOrm(this.config.database, "safe")
    const val = await orm.em.fork().findOne(Var, { key })
    await orm.close()
    return val?.value
  }
}
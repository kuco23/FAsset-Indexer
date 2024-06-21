import { JsonRpcProvider, Interface, FetchRequest, Contract } from "ethers"
import { createOrm, setVar, getVar } from "./database/utils"
import type { IConfig } from "./config"


export class Context {
  provider: JsonRpcProvider
  assetManagerEventInterface: Interface

  constructor(public config: IConfig) {
    this.provider = this.getEthersApiProvider(config.rpcUrl, config.apiKey)
    this.assetManagerEventInterface = this.getAssetManagerEventInterface()
  }

  getEthersApiProvider(rpcUrl: string, apiKey?: string): JsonRpcProvider {
    const connection = new FetchRequest(rpcUrl)
    if (apiKey !== undefined) {
      connection.setHeader('x-api-key', apiKey)
    }
    return new JsonRpcProvider(connection)
  }

  getAssetManagerEventInterface(): Interface {
    return new Interface(this.config.abis.events)
  }

  getAssetManagerContract(fAsset: string): Contract {
    const contractName = `AssetManager_${fAsset}`
    const address = this.getContractAddress(contractName)
    if (address === undefined) {
      throw new Error(`Contract address not found for ${contractName}`)
    }
    return new Contract(address, this.config.abis.assetManager, this.provider)
  }

  getContractAddress(name: string): string | undefined {
    for (const contract of this.config.contracts) {
      if (contract.name === name)
        return contract.address
    }
  }

  getLogTopic(name: string): string | undefined {
    return this.assetManagerEventInterface.getEvent(name)?.topicHash
  }

  async setDbVar(key: string, value: string) {
    const orm = await createOrm(this.config.database, "safe")
    await setVar(key, value, orm.em.fork())
    await orm.close()
  }

  async getDbVar(key: string): Promise<string | undefined> {
    const orm = await createOrm(this.config.database, "safe")
    const value = await getVar(key, orm.em.fork())
    await orm.close()
    return value
  }
}
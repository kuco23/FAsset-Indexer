import { JsonRpcProvider, Interface } from "ethers"
import type { IConfig } from "./config"


export class Context {
  provider: JsonRpcProvider

  constructor(public config: IConfig) {
    this.provider = new JsonRpcProvider(config.rpcUrl)
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
}
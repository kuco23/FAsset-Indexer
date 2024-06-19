import { Context } from "../context"
import type { Filter, LogDescription, Log } from "ethers"

export class EventScraper {
  constructor(public context: Context) { }

  async getLogs(from: number, to: number): Promise<LogDescription[]> {
    const rawLogs = await this.getRawLogs(from, to)
    return this.parseRawLogs(rawLogs)
  }

  async getRawLogs(from: number, to: number): Promise<Log[]> {
    const filter: Filter = {
      address: this.context.getContractAddress("AssetManager_FTestXRP"),
      fromBlock: from,
      toBlock: to
    }
    return this.context.provider.getLogs(filter)
  }

  async parseRawLogs(rawLogs: Log[]): Promise<LogDescription[]> {
    const iface = this.context.assetManagerEventInterface
    const logs = rawLogs.map((log) => iface.parseLog(log))
    return logs.filter((log) => log !== null) as LogDescription[]
  }
}
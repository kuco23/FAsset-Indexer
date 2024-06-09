import { Context } from "../context"
import type { Filter, LogDescription, Log } from "ethers"

export class EventAggregator {
  constructor(public context: Context) { }

  async getRawLogs(from: number, to: number): Promise<Log[]> {
    const filter: Filter = {
      address: this.context.getContractAddress("AssetManager_FTestXRP"),
      fromBlock: from,
      toBlock: to
    }
    return this.context.provider.getLogs(filter)
  }

  async getLogs(from: number, to: number): Promise<LogDescription[]> {
    const rawLogs = await this.getRawLogs(from, to)
    const iface = this.context.getEventInterface()
    const logs = rawLogs.map((log) => iface.parseLog({
      topics: log.topics,
      data: log.data
    }))
    return logs.filter((log) => log !== null) as LogDescription[]
  }
}
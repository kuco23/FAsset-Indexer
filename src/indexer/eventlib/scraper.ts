import type { Context } from "../../context"
import type { Filter, Log } from "ethers"


export type EventArgs = (string & number & bigint)[]

export interface FullLog {
  name: string
  args: EventArgs
  blockNumber: number
  transactionIndex: number
  logIndex: number
  source: string
  blockTimestamp: number
  transactionHash: string
}

interface LogUri {
  blockNumber: number
  transactionIndex: number
  index: number
}

export class EventScraper {
  constructor(public readonly context: Context) { }

  async getLogs(from: number, to: number): Promise<FullLog[]> {
    const rawLogs = await this.getRawLogs(from, to)
    return this.parseRawLogs(rawLogs)
  }

  async getRawLogs(from: number, to: number): Promise<Log[]> {
    const filter: Filter = {
      address: this.context.getContractAddress("AssetManager_FTestXRP"),
      fromBlock: from,
      toBlock: to
    }
    const logs = await this.context.provider.getLogs(filter)
    return logs.sort(EventScraper.logOrder) // enforce correct order
  }

  protected async parseRawLogs(rawLogs: Log[]): Promise<FullLog[]> {
    const iface = this.context.assetManagerEventInterface
    let blockTimestamp: number | null = null
    let lastBlockNumber: number | null = null
    const logs: FullLog[] = []
    for (const log of rawLogs) {
      const logDescription = iface.parseLog(log)
      if (logDescription === null) continue
      if (blockTimestamp === null || lastBlockNumber !== log.blockNumber) {
        const block = await this.context.provider.getBlock(log.blockNumber)
        if (block === null) {
          throw new Error("Failed to fetch block")
        }
        blockTimestamp = block.timestamp
        lastBlockNumber = log.blockNumber
      }
      logs.push({
        name: logDescription.name,
        args: logDescription.args as any as (string & number & bigint)[],
        blockNumber: log.blockNumber,
        transactionIndex: log.transactionIndex,
        logIndex: log.index,
        source: log.address,
        transactionHash: log.transactionHash,
        blockTimestamp: blockTimestamp
      })
    }
    return logs
  }

  private static logOrder(log1: LogUri, log2: LogUri): number {
    if (log1.blockNumber !== log2.blockNumber) {
        return log1.blockNumber - log2.blockNumber;
    } else if (log1.transactionIndex !== log2.transactionIndex) {
        return log1.transactionIndex - log2.transactionIndex;
    } else {
        return log1.index - log2.index;
    }
  }
}
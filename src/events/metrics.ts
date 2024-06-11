import { createOrm } from "../database/utils"
import { EvmLog } from "../database/entities"
import { Context } from "../context"
import { EventScraper } from "./scraper"
import type { Interface, LogDescription } from "ethers"

export class EventMetrics {
  eventScraper: EventScraper
  evmEventIface: Interface

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
    this.evmEventIface = this.context.getEventInterface()
  }

  async totalRedeemed(): Promise<bigint> {
    const aggregator = (value: bigint, log: LogDescription): bigint => {
      if (log.name === "RedemptionPerformed") {
        value += BigInt(log.args[5])
      }
      return value
    }
    return this.eventAggregator("RedemptionPerformed", BigInt(0), aggregator)
  }

  private async eventAggregator<T>(eventName: string, value: T, aggregator: (value: T, log: LogDescription) => T): Promise<T> {
    const topic = this.getLogTopic(eventName)
    const orm = await createOrm(this.context.config.database, "safe")
    const logs = await orm.em.fork().find(EvmLog, { topics: { hash: topic } })
    for (const log of logs) {
      await log.topics.load()
      const event = this.evmEventIface.parseLog({
        topics: log.topics.map((topic) => topic.hash),
        data: log.data
      })
      if (event !== null) {
        value = aggregator(value, event)
      }
    }
    await orm.close()
    return value
  }

  getLogTopic(eventName: string): string | undefined {
    const iface = this.context.getEventInterface()
    return iface.getEvent(eventName)?.topicHash
  }

}
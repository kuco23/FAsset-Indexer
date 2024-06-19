import { createOrm } from "../database/utils"
import { EvmLog } from "../database/entities/logs"
import { Context } from "../context"
import { EventScraper } from "./scraper"
import { MINTING_EXECUTED, REDEMPTION_DEFAULT, REDEMPTION_PERFORMED } from "../constants"
import type { Interface, LogDescription } from "ethers"

export class EventMetrics {
  eventScraper: EventScraper

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
  }

  async totalMinted(): Promise<bigint> {
    return this.eventAggregator(MINTING_EXECUTED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[2])
    })
  }

  async totalMintingFees(): Promise<bigint> {
    return this.eventAggregator(MINTING_EXECUTED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[3])
    })
  }

  async totalRedeemed(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_PERFORMED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[5])
    })
  }

  async totalRedemptionDefaultValue(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_DEFAULT, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[3])
    })
  }

  async totalRedemptionDefaults(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_DEFAULT, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(1)
    })
  }

  async totalRedeemedPoolCollateral(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_DEFAULT, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[5])
    })
  }

  private async eventAggregator<T>(eventName: string, value: T, aggregator: (value: T, log: LogDescription) => T): Promise<T> {
    const orm = await createOrm(this.context.config.database, "safe")
    const topic = this.getLogTopic(eventName)
    const logs = await orm.em.fork().find(EvmLog, { topics: { hash: topic } })
    for (const log of logs) {
      await log.topics.load()
      const event = this.context.assetManagerEventInterface.parseLog({
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
    return this.context.assetManagerEventInterface.getEvent(eventName)?.topicHash
  }

}
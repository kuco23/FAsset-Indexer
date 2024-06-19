import { createOrm } from "../database/utils"
import { EvmLog } from "../database/entities/logs"
import { Context } from "../context"
import { EventScraper } from "./scraper"
import { MINTING_EXECUTED, REDEMPTION_DEFAULTED, REDEMPTION_PERFORMED } from "../constants"
import type { Interface, LogDescription } from "ethers"

export class EventMetrics {
  eventScraper: EventScraper
  evmEventIface: Interface

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
    this.evmEventIface = this.context.getEventInterface()
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
    return this.eventAggregator(REDEMPTION_DEFAULTED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[3])
    })
  }

  async totalRedemptionDefaults(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_DEFAULTED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(1)
    })
  }

  async totalRedeemedPoolCollateral(): Promise<bigint> {
    return this.eventAggregator(REDEMPTION_DEFAULTED, BigInt(0), (value: bigint, log: LogDescription) => {
      return value + BigInt(log.args[5])
    })
  }

  private async eventAggregator<T>(eventName: string, value: T, aggregator: (value: T, log: LogDescription) => T): Promise<T> {
    const orm = await createOrm(this.context.config.database, "safe")
    const topic = this.getLogTopic(eventName)
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
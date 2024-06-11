import { EventScraper } from "./scraper"
import { config } from "../config"
import { Context } from "../context"
import { EvmLog, EvmLogTopic } from "../database/entities"
import { createOrm } from "../database/utils"
import { retryUntilSuccess, sleep } from "../utils"
import type { EntityManager } from "@mikro-orm/knex"
import type { Log } from "ethers"


const EVENT_STEP = 30
const MID_EVENT_SLEEP_MS = 200
const EVENT_FETCH_RETRIES = 100

export class EventIndexer {
  eventScraper: EventScraper

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
  }

  async runScraper(start: number, end: number): Promise<void> {
    const orm = await createOrm(config.database, "safe")
    const lastBlock = await this.context.getVar("lastEventBlock")
    if (lastBlock !== undefined && parseInt(lastBlock) > start) {
      start = parseInt(lastBlock)
    }
    for (let i = start; i < end; i += EVENT_STEP) {
      const logFetch = () => this.eventScraper.getRawLogs(i, i + EVENT_STEP)
      const logs = await retryUntilSuccess(logFetch, EVENT_FETCH_RETRIES)
      await this.storeRawLogs(orm.em, logs)
      await this.context.setVar("lastEventBlock", (i + EVENT_STEP).toString())
      await sleep(MID_EVENT_SLEEP_MS)
      console.log(`Processed logs up to block ${i + EVENT_STEP}`)
    }
    await orm.close()
  }

  private async storeRawLogs(em: EntityManager, logs: Log[]): Promise<void> {
    for (const log of logs) {
      await this.storeRawLog(em, log)
    }
  }

  private async storeRawLog(em: EntityManager, log: Log): Promise<void> {
    await em.transactional(async (_em) => {
      const topics = log.topics.map((hash) => new EvmLogTopic(hash))
      const event = new EvmLog(topics, log.data, log.blockNumber, log.address, log.transactionHash)
      _em.persistAndFlush(event)
    })
  }
}

async function main() {
  const START_BLOCK = 16146574
  const END_BLOCK = 16494155
  const context = new Context(config)
  const monitor = new EventIndexer(context)
  await monitor.runScraper(START_BLOCK, END_BLOCK)
}

main()
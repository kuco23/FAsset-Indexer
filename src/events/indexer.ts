import { EventScraper } from "./scraper"
import { FIRST_UNHANDLED_EVENT_BLOCK_KEY, LOG_FETCH_SIZE, LOG_FETCH_RETRY_LIMIT, LOG_FETCH_SLEEP_MS } from "../constants"
import { config } from "../config"
import { Context } from "../context"
import { EvmLog, EvmLogTopic } from "../database/entities/logs"
import { createOrm, setVar } from "../database/utils"
import { retryUntilSuccess, sleep } from "../utils"
import type { Log } from "ethers"
import type { EntityManager } from "@mikro-orm/knex"


export class EventIndexer {
  eventScraper: EventScraper

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
  }

  async run(start: number, end: number): Promise<void> {
    const orm = await createOrm(config.database, "safe")
    const firstUnhandledBlock = await this.firstUnhandledBlock()
    if (firstUnhandledBlock > start) {
      start = firstUnhandledBlock
    }
    for (let i = start; i < end; i += LOG_FETCH_SIZE) {
      const logFetch = () => this.eventScraper.getRawLogs(i, i + LOG_FETCH_SIZE)
      const logs = await retryUntilSuccess(logFetch, LOG_FETCH_RETRY_LIMIT)
      await this.storeRawLogs(orm.em, logs, i + LOG_FETCH_SIZE)
      console.log(`Processed logs from block ${i} to block ${i + LOG_FETCH_SIZE - 1}`)
      await sleep(LOG_FETCH_SLEEP_MS)
    }
    await orm.close()
  }

  private async storeRawLogs(em: EntityManager, logs: Log[], firstUnhandledBlock: number): Promise<void> {
    await em.transactional(async (_em) => {
      for (const log of logs) {
        const topics = log.topics.map((hash) => new EvmLogTopic(hash))
        const event = new EvmLog(log.address, topics, log.data, log.blockNumber, log.transactionIndex, log.index)
        _em.persist(event)
      }
      await setVar(FIRST_UNHANDLED_EVENT_BLOCK_KEY, firstUnhandledBlock.toString(), _em)
      await _em.flush()
    })
  }

  private async firstUnhandledBlock(): Promise<number> {
    const lastBlock = await this.context.getVar(FIRST_UNHANDLED_EVENT_BLOCK_KEY)
    return lastBlock !== undefined ? parseInt(lastBlock) : 0
  }
}

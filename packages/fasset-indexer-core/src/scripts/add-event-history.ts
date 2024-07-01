/* import { Context } from "../context"
import { config } from "../config"
import { EventScraper } from "../indexer/eventlib/event-scraper"
import { EventIndexer } from "../indexer/eventlib/indexer"
import { EvmLog } from "../database/entities/logs"

async function main() {
  const context = await Context.create(config)
  const eventScraper = new EventScraper(context)


  const dbEvents = await context.orm.em.find(EvmLog, { name: 'AgentVaultCreated' })


  const logs = await eventScraper.getLogs(17192164, 17192194)
  for (const a of logs) {
    console.log(a.blockNumber, a.transactionIndex, a.logIndex, a.name)
  }
  await context.orm.close()
} */
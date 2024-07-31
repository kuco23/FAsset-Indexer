/* import { NotFoundError } from "@mikro-orm/core"
import { config } from "./config/config"
import { Context } from "./context"
import { AgentVault } from "./database/entities/agent"
import { CollateralReservationDeleted } from "./database/entities/events/minting"
import { EventScraper } from "./indexer/eventlib/event-scraper"
import { deleteVar } from "./indexer/shared"

async function main() {
  const context = await Context.create(config)
  const scraper = new EventScraper(context)
  console.log('here')
  const logs = await scraper.getLogs(17192164, 17192194)
  console.log(logs[0])  
  await context.orm.close()
}


main() */
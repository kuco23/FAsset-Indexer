import { EventIndexer } from "../indexer/eventlib/indexer"
import { Context } from "../context"
import { config } from "../config"

async function runIndexer(start?: number) {
  const context = await Context.create(config)
  const eventIndexer = new EventIndexer(context)
  process.on("SIGINT", () => {
    console.log("Stopping indexer...")
    eventIndexer.requestStop()
  })
  await eventIndexer.run(start)
}

runIndexer()
import { EventIndexer } from "../eventlib/indexer"
import { config } from "../../config"
import { Context } from "../../context"

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
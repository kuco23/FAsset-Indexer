import { Command, OptionValues } from "commander"
import { config } from "../config"
import { Context } from "../context"
import { EventIndexer } from "../events/indexer"


const program = new Command("Open Beta Monitor CLI")
const context = new Context(config)
const eventIndexer = new EventIndexer(context)

program
  .command('logs')
  .description('Get and store new logs')
  .option('-s, --start <number>', 'Start block number', '16146574')
  .option('-e, --end <number>', 'End block number')
  .action(async (options: OptionValues) => {
    const start = parseInt(options.start)
    const end = options.end !== undefined
      ? parseInt(options.end)
      : await context.provider.getBlockNumber()
    await eventIndexer.run(start, end)
  })
  .command('run')
  .description('Run the indexer')
  .option('-s, --start <number>', 'Start block number', '16146574')
  .action(async (options: OptionValues) => {
    const start = parseInt(options.start)

  })

async function runIndexer(start: number) {
  
  const end = await context.provider.getBlockNumber()
  await eventIndexer.run(start, end)
}

program.parseAsync()

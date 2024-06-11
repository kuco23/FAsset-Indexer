import { Command } from "commander"
import { config } from "../config"
import { Context } from "../context"
import { EventMetrics } from "../events/metrics"


const program = new Command("Open Beta Monitor CLI")
const context = new Context(config)

const eventMetrics = new EventMetrics(context)

program
  .command('totalRedeemed')
  .description('Get the total amount of redemption')
  .action(async () => {
    const totalRedemptions = await eventMetrics.totalRedeemed()
    console.log(`Total redeemed: ${totalRedemptions}`)
  })

program.parseAsync()

import { Command } from "commander"
import { EventMetrics } from "../events/metrics"
import { Context } from "../context"
import { config } from "../config"


const context = new Context(config)
const eventMetrics = new EventMetrics(context)
const program = new Command("Open Beta Monitor CLI")

program
  .command('aggregate')
  .description('Get the total amount of redemption')
  .argument('<totalMinted|totalMintingFees|totalRedeemed|totalRedemptionDefaultValue>', 'The metric to aggregate')
  .action(async (metricName: string) => {
    const metricInfo = await (eventMetrics as any)[metricName]()
    console.log(`${metricName}: ${metricInfo}`)
  })

program.parseAsync()

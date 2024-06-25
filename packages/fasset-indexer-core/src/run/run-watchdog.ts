import { StateWatchdog } from "../watchdog"
import { Context } from "../context"
import { config } from "../config"


async function runWatchdog() {
  const context = await Context.create(config)
  const watchdog = new StateWatchdog(context)
  await watchdog.run()
}

runWatchdog()
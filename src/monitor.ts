import { EventAggregator } from "./aggregators/events"
import { config } from "./config"
import { Context } from "./context"
import { EvmEvent, EvmEventTopic } from "./database/entities"
import { createOrm } from "./database/utils"


async function main() {
  /* const start = 16373892
  const end = 16373920
  const context = new Context(config)
  const events = new EventAggregator(context)
  const logs = await events.getLogs(start, end)
  console.log(logs) */

  const orm = await createOrm(config.database, "safe")
  await orm.em.transactional(async (em) => {
    const topics = [
      '0x0d418f2ae12260f9d0ceacf72b08fcc4b05560719443f40d3761ee90da0d8fa5',
      '0x0000000000000000000000000d9f03b5e547c96e90cda18d2e65d0dfa80b5e61',
      '0x000000000000000000000000000000000000000000000000000000000001f611'
    ]
    const evmTopics = topics.map((topic) => new EvmEventTopic(topic))
    const event = new EvmEvent(evmTopics,
      "0x0000000000000000000000000000000000000000000000000000000001312d0000000000000000000000000000000000000000000000000000000000000046a4000000000000000000000000000000000000000000000000000000000000653c",
      16373902
    )
    await em.persistAndFlush(event)
  })
  await orm.close()
}

main()

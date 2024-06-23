import { createOrm } from "../database/utils"
import { EvmLog } from "../database/entities/logs"
import { Context } from "../context"
import { EventScraper } from "./eventlib/scraper"
import { MINTING_EXECUTED, REDEMPTION_DEFAULT, REDEMPTION_PERFORMED, COLLATERAL_TYPE_ADDED } from "../constants"
import type { LogDescription } from "ethers"

export class EventMetrics {
  eventScraper: EventScraper

  constructor(public context: Context) {
    this.eventScraper = new EventScraper(context)
  }

}
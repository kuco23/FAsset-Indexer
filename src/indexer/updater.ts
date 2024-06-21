import { EntityManager } from "@mikro-orm/knex"
import type { LogDescription } from "ethers"
import { AGENT_SETTING_CHANGED } from "../constants"


export class EventStateUpdater {

  protected async storeEvent(em: EntityManager, logDescription: LogDescription): Promise<void> {
    switch (logDescription.name) {
      case AGENT_SETTING_CHANGED: {
        
      }
    }
  }

}
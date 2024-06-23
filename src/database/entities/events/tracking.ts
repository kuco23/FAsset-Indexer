import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { EvmLog, EventBound } from "../logs"
import { ADDRESS_LENGTH } from "../../../constants"
import { AgentVault } from "../agent"


@Entity()
export class RedemptionRequestIncomplete extends EventBound {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: "string", length: ADDRESS_LENGTH })
  redeemer: string

  @Property({ type: 'number' })
  remainingLots: number

  constructor(evmLog: EvmLog, redeemer: string, remainingLots: number) {
    super(evmLog)
    this.redeemer = redeemer
    this.remainingLots = remainingLots
  }
}

@Entity()
export class AgentSettingChanged extends EventBound {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'string' })
  name: string

  @Property({ type: 'number' })
  value: number

  constructor(evmLog: EvmLog, agentVault: AgentVault, name: string, value: number) {
    super(evmLog)
    this.agentVault = agentVault
    this.name = name
    this.value = value
  }
}
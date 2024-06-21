import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core'
import { EventBound } from '../logs'
import { AgentVault } from '../agent'
import { ADDRESS_LENGTH } from '../../../constants'
import type { EvmLog } from '../logs'


class LiquidationStartedBase extends EventBound {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'number' })
  timestamp: number

  constructor(evmLog: EvmLog, agentVault: AgentVault, timestamp: number) {
    super(evmLog)
    this.agentVault = agentVault
    this.timestamp = timestamp
  }
}

@Entity()
export class LiquidationStarted extends LiquidationStartedBase { }

@Entity()
export class FullLiquidationStarted extends LiquidationStartedBase { }

@Entity()
export class LiquidationPerformed extends EventBound {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  liquidator: string

  @Property({ type: 'number' })
  valueUBA: number

  constructor(evmLog: EvmLog, agentVault: AgentVault, liquidator: string, valueUBA: number) {
    super(evmLog)
    this.agentVault = agentVault
    this.liquidator = liquidator
    this.valueUBA = valueUBA
  }
}

@Entity()
export class LiquidationEnded extends EventBound {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  constructor(evmLog: EvmLog, agentVault: AgentVault) {
    super(evmLog)
    this.agentVault = agentVault
  }
}
import { Entity, PrimaryKey, Property, Unique, OneToOne } from "@mikro-orm/core"
import { ADDRESS_LENGTH, BYTES32_LENGTH } from "../../constants"

@Entity()
@Unique({ properties: ['blockNumber', 'transactionIndex', 'logIndex'] })
export class EvmLog {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: "number" })
  blockNumber: number

  @Property({ type: "number" })
  transactionIndex: number

  @Property({ type: "number" })
  logIndex: number

  @Property({ type: "text" })
  name: string

  @Property({ type: "text", length: ADDRESS_LENGTH })
  address: string

  @Property({ type: "text", length: BYTES32_LENGTH })
  transaction: string

  @Property({ type: 'number' })
  timestamp: number

  constructor(
    blockNumber: number, transactionIndex: number, logIndex: number,
    name: string, address: string, transaction: string, timestamp: number
  ) {
    this.blockNumber = blockNumber
    this.transactionIndex = transactionIndex
    this.logIndex = logIndex
    this.name = name
    this.address = address
    this.transaction = transaction
    this.timestamp = timestamp
  }
}

export class EventBound {

  @OneToOne({ entity: () => EvmLog, owner: true, unique: true })
  evmLog: EvmLog

  constructor(evmLog: EvmLog) {
    this.evmLog = evmLog
  }

}
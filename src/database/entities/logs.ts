import { Cascade, Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property, PrimaryKeyProp } from "@mikro-orm/core";
import { ADDRESS_LENGTH, BYTES32_LENGTH } from "../../constants";


@Entity()
export class EvmLog {

  @PrimaryKey({ type: "number" })
  blockNumber: number

  @PrimaryKey({ type: "number" })
  transactionIndex: number

  @PrimaryKey({ type: "number" })
  logIndex: number

  [PrimaryKeyProp]?: [number, number, number]

  @Property({ type: "text", length: ADDRESS_LENGTH, nullable: true })
  address: string

  @OneToMany(() => EvmLogTopic, topic => topic.evmLog, { cascade: [Cascade.ALL] })
  topics = new Collection<EvmLogTopic>(this)

  @Property({ type: "text" })
  data: string

  constructor(address: string, topics: EvmLogTopic[], data: string, blockNumber: number, transactionIndex: number, logIndex: number) {
    this.address = address
    for (const topic of topics) {
      this.topics.add(topic)
    }
    this.data = data
    this.blockNumber = blockNumber
    this.transactionIndex = transactionIndex
    this.logIndex = logIndex
  }
}

@Entity()
export class EvmLogTopic {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @ManyToOne(() => EvmLog, { fieldName: 'topics' })
  evmLog!: EvmLog

  @Property({ type: 'text', length: BYTES32_LENGTH })
  hash: string

  constructor(hash: string) {
    this.hash = hash
  }
}

@Entity()
export class Var {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: "text", unique: true })
  key: string

  @Property({ type: "text" })
  value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }
}
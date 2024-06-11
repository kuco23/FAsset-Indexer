import { Cascade, Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

const ADDRESS_LENGTH = 42
const BYTES32_LENGTH = 66

@Entity()
export class EvmLog {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @OneToMany(() => EvmLogTopic, topic => topic.evmLog, { cascade: [Cascade.ALL] })
  topics = new Collection<EvmLogTopic>(this)

  @Property({ type: "text" })
  data: string

  @Property({ type: "number" })
  blockNumber: number

  @Property({ type: "text", length: ADDRESS_LENGTH, nullable: true })
  address: string

  @Property({ type: "text", length: BYTES32_LENGTH, nullable: true })
  transactionHash: string

  constructor(topics: EvmLogTopic[], data: string, blockNumber: number, address: string, transactionHash: string) {
    for (const topic of topics) {
      this.topics.add(topic)
    }
    this.data = data
    this.blockNumber = blockNumber
    this.address = address
    this.transactionHash = transactionHash
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
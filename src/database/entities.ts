import { Cascade, Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

const ADDRESS_LENGTH = 42
const BYTES32_LENGTH = 66

@Entity()
export class EvmEvent {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: "text" })
  data: string

  @Property({ type: "number" })
  blockNumber: number

  @Property({ type: "text", length: ADDRESS_LENGTH, nullable: true })
  address?: string

  @Property({ type: "text", length: BYTES32_LENGTH, nullable: true })
  transactionHash?: string

  @OneToMany(() => EvmEventTopic, topic => topic.evmEvent, { cascade: [Cascade.ALL] })
  topics = new Collection<EvmEventTopic>(this)

  constructor(topics: EvmEventTopic[], data: string, blockNumber: number, address?: string, transactionHash?: string) {
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
export class EvmEventTopic {

  @PrimaryKey({ type: 'text', length: BYTES32_LENGTH })
  hash: string

  @ManyToOne(() => EvmEvent, { fieldName: 'topics' })
  evmEvent!: EvmEvent

  constructor(hash: string) {
    this.hash = hash
  }
}
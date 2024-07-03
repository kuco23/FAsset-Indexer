import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core"
import { ADDRESS_LENGTH } from "../../constants"


export enum AddressType { USER, AGENT, SYSTEM }

@Entity()
export class EvmAddress {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  address: string

  @Enum(() => AddressType)
  type: AddressType

  constructor(address: string, type: AddressType) {
    this.address = address
    this.type = type
  }
}

@Entity()
export class UnderlyingAddress {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'text', unique: true })
  address: string

  @Enum(() => AddressType)
  type: AddressType

  constructor(address: string, type: AddressType) {
    this.address = address
    this.type = type
  }
}
import { Entity, PrimaryKey, Property } from "@mikro-orm/core"


@Entity()
export class Var {

  @PrimaryKey({ type: "text" })
  key: string

  @Property({ type: "text", nullable: true })
  value?: string

  @Property({ type: "number", nullable: true })
  lastUpdate?: number

  constructor(key: string, value?: string, lastUpdate?: number) {
    this.key = key
    this.value = value
    this.lastUpdate = lastUpdate
  }
}

@Entity()
export class UntrackedAgentVault {

  @PrimaryKey({ type: "text" })
  address: string

  constructor(address: string) {
    this.address = address
  }
}
import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { ADDRESS_LENGTH } from "../../../constants"


@Entity()
export class RedemptionRequestIncomplete {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: "string", length: ADDRESS_LENGTH })
  redeemer: string

  @Property({ type: 'number' })
  remainingLots: number

  constructor(redeemer: string, remainingLots: number) {
    this.redeemer = redeemer
    this.remainingLots = remainingLots
  }
}
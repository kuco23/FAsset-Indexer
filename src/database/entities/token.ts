import { Entity, Property, PrimaryKey } from "@mikro-orm/core"
import { ADDRESS_LENGTH } from "../../constants"


@Entity()
export class CollateralToken {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'number' })
  collateralClass: number

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  address: string

  @Property({ type: 'number', precision: 3 })
  decimals: number

  @Property({ type: 'boolean' })
  directPricePair: boolean

  @Property({ type: 'text' })
  assetFtsoSymbol: string

  @Property({ type: 'text' })
  tokenFtsoSymbol: string

  constructor(
    collateralClass: number,
    address: string,
    decimals: number,
    directPricePair: boolean,
    assetFtsoSymbol: string,
    tokenFtsoSymbol: string,
  ) {
    this.collateralClass = collateralClass
    this.address = address
    this.decimals = decimals
    this.directPricePair = directPricePair
    this.assetFtsoSymbol = assetFtsoSymbol
    this.tokenFtsoSymbol = tokenFtsoSymbol
  }
}
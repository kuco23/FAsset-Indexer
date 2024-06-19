import { Entity, Property, PrimaryKey, BigIntType } from "@mikro-orm/core"
import { ADDRESS_LENGTH } from "../../constants"


@Entity()
export class CollateralToken {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'number' })
  collateralClass: number

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  address: string

  @Property({ type: 'number' })
  decimals: number

  @Property({ type: 'boolean' })
  directPricePair: boolean

  @Property({ type: 'text' })
  assetFtsoSymbol: string

  @Property({ type: 'text' })
  tokenFtsoSymbol: string

  @Property({ type: new BigIntType('bigint') })
  minCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  ccbMinCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  safetyMinCollateralRatioBIPS: bigint

  constructor(
    collateralClass: number,
    address: string,
    decimals: number,
    directPricePair: boolean,
    assetFtsoSymbol: string,
    tokenFtsoSymbol: string,
    minCollateralRatioBIPS: bigint,
    ccbMinCollateralRatioBIPS: bigint,
    safetyMinCollateralRatioBIPS: bigint
  ) {
    this.collateralClass = collateralClass
    this.address = address
    this.decimals = decimals
    this.directPricePair = directPricePair
    this.assetFtsoSymbol = assetFtsoSymbol
    this.tokenFtsoSymbol = tokenFtsoSymbol
    this.minCollateralRatioBIPS = minCollateralRatioBIPS
    this.ccbMinCollateralRatioBIPS = ccbMinCollateralRatioBIPS
    this.safetyMinCollateralRatioBIPS = safetyMinCollateralRatioBIPS
  }
}
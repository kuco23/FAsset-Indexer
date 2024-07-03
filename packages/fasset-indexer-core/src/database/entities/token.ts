import { Entity, Property, OneToOne } from "@mikro-orm/core"
import { EvmAddress } from "./address"


@Entity()
export class VaultCollateralToken {

  @OneToOne({ entity: () => EvmAddress, owner: true, primary: true })
  address: string

  @Property({ type: 'number' })
  decimals: number

  @Property({ type: 'boolean' })
  directPricePair: boolean

  @Property({ type: 'text' })
  assetFtsoSymbol: string

  @Property({ type: 'text' })
  tokenFtsoSymbol: string

  constructor(
    address: string,
    decimals: number,
    directPricePair: boolean,
    assetFtsoSymbol: string,
    tokenFtsoSymbol: string,
  ) {
    this.address = address
    this.decimals = decimals
    this.directPricePair = directPricePair
    this.assetFtsoSymbol = assetFtsoSymbol
    this.tokenFtsoSymbol = tokenFtsoSymbol
  }
}
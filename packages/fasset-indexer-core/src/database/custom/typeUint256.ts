import { Type, Platform, EntityProperty, DecimalType } from '@mikro-orm/core';


export class uint256 extends Type<bigint, string> {

  convertToDatabaseValue(value: bigint): string {
    return value.toString()
  }

  convertToJSValue(value: string): bigint {
    return BigInt(value)
  }

  getColumnType() {
    return `NUMERIC(78)`
  }

}
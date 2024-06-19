import { Entity, PrimaryKey, Property } from "@mikro-orm/core"


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
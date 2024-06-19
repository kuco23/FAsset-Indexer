import { Cascade, Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { ADDRESS_LENGTH } from "../../constants"


@Entity()
export class AgentManager {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  address: string

  @OneToMany(() => Agent, vault => vault.manager, { cascade: [Cascade.ALL] })
  agents = new Collection<Agent>(this)

  constructor(address: string) {
    this.address = address
  }
}

@Entity()
export class Agent {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  address: string

  @ManyToOne(() => AgentManager, { fieldName: 'agents' })
  manager: AgentManager

  @OneToMany(() => AgentVault, vault => vault.owner, { cascade: [Cascade.ALL] })
  vaults = new Collection<AgentVault>(this)

  constructor(address: string, manager: AgentManager) {
    this.address = address
    this.manager = manager
  }
}

@Entity()
export class AgentVault {

  @PrimaryKey({ type: "number", autoincrement: true })
  id!: number

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  address: string

  @Property({ type: 'text', unique: true })
  underlyingAddress: string

  @Property({ type: 'text', length: ADDRESS_LENGTH, unique: true })
  collateralPool: string

  @ManyToOne(() => Agent, { fieldName: 'vaults' })
  owner: Agent

  constructor(address: string, underlyingAddress: string, collateralPool: string,  owner: Agent) {
    this.address = address
    this.underlyingAddress = underlyingAddress
    this.collateralPool = collateralPool
    this.owner = owner
  }

}
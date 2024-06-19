import { Entity, Property, ManyToOne, PrimaryKey, BigIntType, OneToOne } from '@mikro-orm/core'
import { AgentVault } from '../agent'
import { ADDRESS_LENGTH, BYTES32_LENGTH, AGENT_SETTINGS_CHANGED } from '../../../constants'

@Entity()
export class AgentSettingsChanged {
  
}
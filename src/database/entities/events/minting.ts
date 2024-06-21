import { Entity, Property, ManyToOne, PrimaryKey, BigIntType, OneToOne } from '@mikro-orm/core'
import { EvmLog, EventBound } from '../logs'
import { AgentVault } from '../agent'
import { ADDRESS_LENGTH, BYTES32_LENGTH } from '../../../constants'


@Entity()
export class CollateralReserved extends EventBound {

  @PrimaryKey({ type: 'number' })
  collateralReservationId: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  minter: string

  @Property({ type: new BigIntType('bigint') })
  valueUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  feeUBA: bigint

  @Property({ type: 'number' })
  firstUnderlyingBlock: number

  @Property({ type: 'number' })
  lastUnderlyingBlock: number

  @Property({ type: 'number' })
  lastUnderlyingTimestamp: number

  @Property({ type: 'text' })
  paymentAddress: string

  @Property({ type: 'text', length: BYTES32_LENGTH, unique: true })
  paymentReference: string

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  executor: string

  @Property({ type: new BigIntType('bigint') })
  executorFeeNatWei: bigint

  constructor(
    evmLog: EvmLog,
    collateralReservationId: number,
    agentVault: AgentVault,
    minter: string,
    valueUBA: bigint,
    feeUBA: bigint,
    firstUnderlyingBlock: number,
    lastUnderlyingBlock: number,
    lastUnderlyingTimestamp: number,
    paymentAddress: string,
    paymentReference: string,
    executor: string,
    executorFeeNatWei: bigint
  ) {
    super(evmLog)
    this.agentVault = agentVault
    this.minter = minter
    this.collateralReservationId = collateralReservationId
    this.valueUBA = valueUBA
    this.feeUBA = feeUBA
    this.firstUnderlyingBlock = firstUnderlyingBlock
    this.lastUnderlyingBlock = lastUnderlyingBlock
    this.lastUnderlyingTimestamp = lastUnderlyingTimestamp
    this.paymentAddress = paymentAddress
    this.paymentReference = paymentReference
    this.executor = executor
    this.executorFeeNatWei = executorFeeNatWei
  }
}

@Entity()
export class MintingExecuted extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => CollateralReserved })
  collateralReserved: CollateralReserved

  @Property({ type: new BigIntType('bigint') })
  poolFeeUBA: bigint

  constructor(evmLog: EvmLog, collateralReserved: CollateralReserved, poolFeeUBA: bigint) {
    super(evmLog)
    this.collateralReserved = collateralReserved
    this.poolFeeUBA = poolFeeUBA
  }
}

@Entity()
export class MintingPaymentDefault extends EventBound {

  @OneToOne(() => CollateralReserved, { primary: true, entity: () => CollateralReserved, owner: true })
  collateralReserved: CollateralReserved

  constructor(evmLog: EvmLog, collateralReserved: CollateralReserved) {
    super(evmLog)
    this.collateralReserved = collateralReserved
  }
}

@Entity()
export class CollateralReservationDeleted extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => CollateralReserved })
  collateralReserved: CollateralReserved

  constructor(evmLog: EvmLog, collateralReserved: CollateralReserved) {
    super(evmLog)
    this.collateralReserved = collateralReserved
  }
}
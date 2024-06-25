import { Entity, ManyToOne, PrimaryKey, Property, BigIntType, OneToOne } from "@mikro-orm/core"
import { AgentVault } from "../agent"
import { EvmLog, EventBound } from "../logs"
import { ADDRESS_LENGTH, BYTES32_LENGTH } from "../../../constants"


@Entity()
export class RedemptionRequested extends EventBound {

  @PrimaryKey({ type: 'number' })
  requestId: number

  @ManyToOne({ entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  redeemer: string

  @Property({ type: 'text' })
  paymentAddress: string

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

  @Property({ type: 'text', length: BYTES32_LENGTH })
  paymentReference: string

  @Property({ type: 'text', length: ADDRESS_LENGTH })
  executor: string

  @Property({ type: new BigIntType('bigint') })
  executorFeeNatWei: bigint

  constructor(
    evmLog: EvmLog,
    agentVault: AgentVault,
    redeemer: string,
    requestId: number,
    paymentAddress: string,
    valueUBA: bigint,
    feeUBA: bigint,
    firstUnderlyingBlock: number,
    lastUnderlyingBlock: number,
    lastUnderlyingTimestamp: number,
    paymentReference: string,
    executor: string,
    executorFeeNatWei: bigint
  ) {
    super(evmLog)
    this.agentVault = agentVault
    this.redeemer = redeemer
    this.requestId = requestId
    this.paymentAddress = paymentAddress
    this.valueUBA = valueUBA
    this.feeUBA = feeUBA
    this.firstUnderlyingBlock = firstUnderlyingBlock
    this.lastUnderlyingBlock = lastUnderlyingBlock
    this.lastUnderlyingTimestamp = lastUnderlyingTimestamp
    this.paymentReference = paymentReference
    this.executor = executor
    this.executorFeeNatWei = executorFeeNatWei
  }
}

@Entity()
export class RedemptionPerformed extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: new BigIntType('bigint') })
  spentUnderlyingUBA: bigint

  constructor(
    evmLog: EvmLog,
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    spentUnderlyingUBA: bigint
  ) {
    super(evmLog)
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.spentUnderlyingUBA = spentUnderlyingUBA
  }
}

@Entity()
export class RedemptionDefault extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: new BigIntType('bigint') })
  redeemedVaultCollateralWei: bigint

  @Property({ type: new BigIntType('bigint') })
  redeemedPoolCollateralWei: bigint

  constructor(
    evmLog: EvmLog,
    redemptionRequested: RedemptionRequested,
    redeemedVaultCollateralWei: bigint,
    redeemedPoolCollateralWei: bigint
  ) {
    super(evmLog)
    this.redemptionRequested = redemptionRequested
    this.redeemedVaultCollateralWei = redeemedVaultCollateralWei
    this.redeemedPoolCollateralWei = redeemedPoolCollateralWei
  }
}

@Entity()
export class RedemptionRejected extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  constructor(evmLog: EvmLog, redemptionRequested: RedemptionRequested) {
    super(evmLog)
    this.redemptionRequested = redemptionRequested
  }
}

@Entity()
export class RedemptionPaymentBlocked extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: new BigIntType('bigint') })
  spentUnderlyingUBA: bigint

  constructor(
    evmLog: EvmLog,
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    spentUnderlyingUBA: bigint
  ) {
    super(evmLog)
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.spentUnderlyingUBA = spentUnderlyingUBA
  }
}

@Entity()
export class RedemptionPaymentFailed extends EventBound {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: new BigIntType('bigint') })
  spentUnderlyingUBA: bigint

  @Property({ type: 'text' })
  failureReason: string

  constructor(
    evmLog: EvmLog,
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    spentUnderlyingUBA: bigint,
    failureReason: string
  ) {
    super(evmLog)
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.spentUnderlyingUBA = spentUnderlyingUBA
    this.failureReason = failureReason
  }
}
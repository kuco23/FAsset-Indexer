import { Entity, ManyToOne, PrimaryKey, Property, BigIntType, OneToOne } from "@mikro-orm/core"
import { AgentVault } from "../agent"
import { ADDRESS_LENGTH, BYTES32_LENGTH } from "../../../constants"


@Entity()
export class RedemptionRequested {

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
export class RedemptionPerformed {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: 'number' })
  blockNumber: number

  @Property({ type: new BigIntType('bigint') })
  spentUnderlyingUBA: bigint

  constructor(
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    blockNumber: number,
    spentUnderlyingUBA: bigint
  ) {
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.blockNumber = blockNumber
    this.spentUnderlyingUBA = spentUnderlyingUBA
  }
}

@Entity()
export class RedemptionDefault {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: new BigIntType('bigint') })
  redeemedVaultCollateralWei: bigint

  @Property({ type: new BigIntType('bigint') })
  redeemedPoolCollateralWei: bigint

  constructor(
    redemptionRequested: RedemptionRequested,
    redeemedVaultCollateralWei: bigint,
    redeemedPoolCollateralWei: bigint
  ) {
    this.redemptionRequested = redemptionRequested
    this.redeemedVaultCollateralWei = redeemedVaultCollateralWei
    this.redeemedPoolCollateralWei = redeemedPoolCollateralWei
  }
}

@Entity()
export class RedemptionRejected {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  constructor(redemptionRequested: RedemptionRequested) {
    this.redemptionRequested = redemptionRequested
  }
}

@Entity()
export class RedemptionPaymentBlocked {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: new BigIntType('bigint') })
  spentUnderlyingUBA: bigint

  constructor(
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    spentUnderlyingUBA: bigint
  ) {
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.spentUnderlyingUBA = spentUnderlyingUBA
  }
}

@Entity()
export class RedemptionPaymentFailed {

  @OneToOne({ primary: true, owner: true, entity: () => RedemptionRequested })
  redemptionRequested: RedemptionRequested

  @Property({ type: 'text', length: BYTES32_LENGTH })
  transactionHash: string

  @Property({ type: 'number' })
  spentUnderlyingUBA: number

  @Property({ type: 'text' })
  failureReason: string

  constructor(
    redemptionRequested: RedemptionRequested,
    transactionHash: string,
    spentUnderlyingUBA: number,
    failureReason: string
  ) {
    this.redemptionRequested = redemptionRequested
    this.transactionHash = transactionHash
    this.spentUnderlyingUBA = spentUnderlyingUBA
    this.failureReason = failureReason
  }
}

////////////////////////////////////////////////////////////////////////
// not bound to a redemption request, but redemption related

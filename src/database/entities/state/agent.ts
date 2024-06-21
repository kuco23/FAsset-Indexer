import { Entity, Property, ManyToOne, BigIntType, OneToOne } from '@mikro-orm/core'
import { AgentVault } from '../agent'
import { CollateralToken } from '../token'


@Entity()
export class AgentVaultSettings {

  @OneToOne({ primary: true, owner: true, entity: () => AgentVault })
  agentVault: AgentVault

  @ManyToOne({ entity: () => CollateralToken })
  collateralToken: CollateralToken

  @Property({ type: new BigIntType('bigint') })
  feeBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  poolFeeShareBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  mintingVaultCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  mintingPoolCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  buyFAssetByAgentFactorBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  poolExitCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  poolTopupCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  poolTopupTokenPriceFactorBIPS: bigint

  constructor(
    agentVault: AgentVault,
    collateralToken: CollateralToken,
    feeBIPS: bigint,
    poolFeeShareBIPS: bigint,
    mintingVaultCollateralRatioBIPS: bigint,
    mintingPoolCollateralRatioBIPS: bigint,
    buyFAssetByAgentFactorBIPS: bigint,
    poolExitCollateralRatioBIPS: bigint,
    poolTopupCollateralRatioBIPS: bigint,
    poolTopupTokenPriceFactorBIPS: bigint
  ) {
    this.agentVault = agentVault
    this.collateralToken = collateralToken
    this.feeBIPS = feeBIPS
    this.poolFeeShareBIPS = poolFeeShareBIPS
    this.mintingVaultCollateralRatioBIPS = mintingVaultCollateralRatioBIPS
    this.mintingPoolCollateralRatioBIPS = mintingPoolCollateralRatioBIPS
    this.buyFAssetByAgentFactorBIPS = buyFAssetByAgentFactorBIPS
    this.poolExitCollateralRatioBIPS = poolExitCollateralRatioBIPS
    this.poolTopupCollateralRatioBIPS = poolTopupCollateralRatioBIPS
    this.poolTopupTokenPriceFactorBIPS = poolTopupTokenPriceFactorBIPS
  }
}

@Entity()
export class AgentVaultInfo {

  @OneToOne({ primary: true, owner: true, entity: () => AgentVault })
  agentVault: AgentVault

  @Property({ type: 'number' })
  status: number

  @Property({ type: 'boolean' })
  publiclyAvailable: boolean

  @Property({ type: new BigIntType('bigint') })
  freeCollateralLots: bigint

  @Property({ type: new BigIntType('bigint') })
  totalVaultCollateralWei: bigint

  @Property({ type: new BigIntType('bigint') })
  freeVaultCollateralWei: bigint

  @Property({ type: new BigIntType('bigint') })
  vaultCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  totalPoolCollateralNATWei: bigint

  @Property({ type: new BigIntType('bigint') })
  freePoolCollateralNATWei: bigint

  @Property({ type: new BigIntType('bigint') })
  poolCollateralRatioBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  totalAgentPoolTokensWei: bigint

  @Property({ type: new BigIntType('bigint') })
  freeAgentPoolTokensWei: bigint

  @Property({ type: new BigIntType('bigint') })
  mintedUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  reservedUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  redeemingUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  poolRedeemingUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  dustUBA: bigint

  @Property({ type: "number" })
  ccbStartTimestamp: number

  @Property({ type: "number" })
  liquidationStartTimestamp: number

  @Property({ type: new BigIntType('bigint') })
  maxLiquidationAmountUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  liquidationPaymentFactorVaultBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  liquidationPaymentFactorPoolBIPS: bigint

  @Property({ type: new BigIntType('bigint') })
  underlyingBalanceUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  requiredUnderlyingBalanceUBA: bigint

  @Property({ type: new BigIntType('bigint') })
  freeUnderlyingBalanceUBA: bigint

  constructor(
    agentVault: AgentVault,
    status: number,
    publiclyAvailable: boolean,
    freeCollateralLots: bigint,
    totalVaultCollateralWei: bigint,
    freeVaultCollateralWei: bigint,
    vaultCollateralRatioBIPS: bigint,
    totalPoolCollateralNATWei: bigint,
    freePoolCollateralNATWei: bigint,
    poolCollateralRatioBIPS: bigint,
    totalAgentPoolTokensWei: bigint,
    freeAgentPoolTokensWei: bigint,
    mintedUBA: bigint,
    reservedUBA: bigint,
    redeemingUBA: bigint,
    poolRedeemingUBA: bigint,
    dustUBA: bigint,
    ccbStartTimestamp: number,
    liquidationStartTimestamp: number,
    maxLiquidationAmountUBA: bigint,
    liquidationPaymentFactorVaultBIPS: bigint,
    liquidationPaymentFactorPoolBIPS: bigint,
    underlyingBalanceUBA: bigint,
    requiredUnderlyingBalanceUBA: bigint,
    freeUnderlyingBalanceUBA: bigint
  ) {
    this.agentVault = agentVault
    this.status = status
    this.publiclyAvailable = publiclyAvailable
    this.freeCollateralLots = freeCollateralLots
    this.totalVaultCollateralWei = totalVaultCollateralWei
    this.freeVaultCollateralWei = freeVaultCollateralWei
    this.vaultCollateralRatioBIPS = vaultCollateralRatioBIPS
    this.totalPoolCollateralNATWei = totalPoolCollateralNATWei
    this.freePoolCollateralNATWei = freePoolCollateralNATWei
    this.poolCollateralRatioBIPS = poolCollateralRatioBIPS
    this.totalAgentPoolTokensWei = totalAgentPoolTokensWei
    this.freeAgentPoolTokensWei = freeAgentPoolTokensWei
    this.mintedUBA = mintedUBA
    this.reservedUBA = reservedUBA
    this.redeemingUBA = redeemingUBA
    this.poolRedeemingUBA = poolRedeemingUBA
    this.dustUBA = dustUBA
    this.ccbStartTimestamp = ccbStartTimestamp
    this.liquidationStartTimestamp = liquidationStartTimestamp
    this.maxLiquidationAmountUBA = maxLiquidationAmountUBA
    this.liquidationPaymentFactorVaultBIPS = liquidationPaymentFactorVaultBIPS
    this.liquidationPaymentFactorPoolBIPS = liquidationPaymentFactorPoolBIPS
    this.underlyingBalanceUBA = underlyingBalanceUBA
    this.requiredUnderlyingBalanceUBA = requiredUnderlyingBalanceUBA
    this.freeUnderlyingBalanceUBA = freeUnderlyingBalanceUBA
  }
}
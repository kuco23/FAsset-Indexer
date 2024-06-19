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
  
}
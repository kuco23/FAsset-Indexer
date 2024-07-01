import { createOrm, getVar } from "../database/utils"
import { CollateralReserved, MintingExecuted } from "../database/entities/events/minting"
import { RedemptionRequested } from "../database/entities/events/redemption"
import { FullLiquidationStarted, LiquidationPerformed } from "../database/entities/events/liquidation"
import { FIRST_UNHANDLED_EVENT_BLOCK, MAX_DATABASE_ENTRIES_FETCH } from "../constants"
import type { OrmOptions, ORM } from "../database/interface"
import { config } from "../config"


export class Analytics {

  constructor(public readonly orm: ORM) {}

  static async create(path: OrmOptions) {
    const orm = await createOrm(path, "safe")
    return new Analytics(orm)
  }

  async unhandledMintings(): Promise<number> {
    const qb = this.orm.em.qb(MintingExecuted, 'o')
    qb.select('o').where({ poolFeeUBA: null })
    const result = await qb.count('o', true).execute()
    return result[0].count
  }

  ///////////////////////////////////////////////////////////////
  // metadata

  async currentBlock(): Promise<number | null> {
    const v = await getVar(this.orm.em.fork(), FIRST_UNHANDLED_EVENT_BLOCK)
    return (v && v.value) ? parseInt(v.value) : null
  }

  //////////////////////////////////////////////////////////////
  // mintings

  async totalReserved(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(cr.value_uba) as totalValueUBA
      FROM collateral_reserved cr
    `)
    return result[0].totalValueUBA
  }

  async totalMinted(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(cr.value_uba) as totalValueUBA
      FROM minting_executed me
      INNER JOIN collateral_reserved cr ON me.collateral_reserved_collateral_reservation_id = cr.collateral_reservation_id
    `)
    return result[0].totalValueUBA
  }

  async totalMintingDefaulted(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(cr.value_uba) as totalValueUBA
      FROM minting_payment_default mpd
      INNER JOIN collateral_reserved cr ON mpd.collateral_reserved_collateral_reservation_id = cr.collateral_reservation_id
    `)
    return result[0].totalValueUBA
  }

  //////////////////////////////////////////////////////////////////
  // redemptions

  async totalRedemptionRequested(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(value_uba) as totalValueUBA
      FROM redemption_requested
    `)
    return result[0].totalValueUBA
  }

  async totalRedeemed(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(rr.value_uba) as totalValueUBA
      FROM redemption_requested rr
      INNER JOIN redemption_performed rp ON rp.redemption_requested_request_id = rr.request_id
    `)
    return result[0].totalValueUBA
  }

  async totalRedemptionDefaulted(): Promise<bigint> {
    const em = this.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(rr.value_uba) as totalValueUBA
      FROM redemption_requested rr
      INNER JOIN redemption_default rd ON rd.redemption_requested_request_id = rr.request_id
    `)
    return result[0].totalValueUBA
  }

  async totalRedemptionRequesters(unique: boolean): Promise<number> {
    const qb = this.orm.em.qb(RedemptionRequested, 'o')
    const result = await qb.count('o.redeemer', unique).execute()
    return result[0].count
  }

  async totalCollateralReservers(unique: boolean): Promise<number> {
    const qb = this.orm.em.qb(CollateralReserved, 'o')
    const result = await qb.count('o.minter', unique).execute()
    return result[0].count
  }

  async redemptionRequestFromSecondsAgo(seconds: number): Promise<number> {
    const timestamp = Date.now() / 1000 - seconds
    const result = await this.orm.em.getConnection('read').execute(`
      SELECT COUNT(rr.request_id) AS count
      FROM redemption_requested rr
      INNER JOIN evm_log el
      ON rr.evm_log_id = el.id
      WHERE el.timestamp >= ${timestamp}
    `)
    return result[0].count
  }

  async fullLiquidations(): Promise<FullLiquidationStarted[]> {
    return this.orm.em.fork().findAll(FullLiquidationStarted,
      { populate: ['agentVault'], limit: MAX_DATABASE_ENTRIES_FETCH })
  }

  async liquidations(): Promise<LiquidationPerformed[]> {
    return this.orm.em.fork().find(LiquidationPerformed,
      { valueUBA: { $gt: 0 } },
      { populate: ['agentVault'], limit: MAX_DATABASE_ENTRIES_FETCH }
    )
  }
}


async function main() {
  const metrics = await Analytics.create(config.database)
  console.log(await metrics.redemptionRequestFromSecondsAgo(60 * 60))
}

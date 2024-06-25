import { Context } from "../context"
import { CollateralReserved, MintingExecuted } from "../database/entities/events/minting"
import { config } from "../config"
import { RedemptionRequested } from "../database/entities/events/redemption"
import { EvmLog } from "../database/entities/logs"


export class EventMetrics {

  constructor(public readonly context: Context) {}

  async unhandledMintings(): Promise<number> {
    const qb = this.context.orm.em.qb(MintingExecuted, 'o')
    qb.select('o').where({ poolFeeUBA: null })
    const result = await qb.count('o', true).execute()
    return result[0].count
  }

  //////////////////////////////////////////////////////////////
  // mintings

  async totalReserved(): Promise<bigint> {
    const em = this.context.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(cr.value_uba) as totalValueUBA
      FROM collateral_reserved cr
    `)
    return result[0].totalValueUBA
  }

  async totalMinted(): Promise<bigint> {
    const em = this.context.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(cr.value_uba) as totalValueUBA
      FROM minting_executed me
      INNER JOIN collateral_reserved cr ON me.collateral_reserved_collateral_reservation_id = cr.collateral_reservation_id
    `)
    return result[0].totalValueUBA
  }

  async totalMintingDefaulted(): Promise<bigint> {
    const em = this.context.orm.em.fork()
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
    const em = this.context.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(value_uba) as totalValueUBA
      FROM redemption_requested
    `)
    return result[0].totalValueUBA
  }

  async totalRedeemed(): Promise<bigint> {
    const em = this.context.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(rr.value_uba) as totalValueUBA
      FROM redemption_requested rr
      INNER JOIN redemption_performed rp ON rp.redemption_requested_request_id = rr.request_id
    `)
    return result[0].totalValueUBA
  }

  async totalRedemptionDefaulted(): Promise<bigint> {
    const em = this.context.orm.em.fork()
    const result = await em.getConnection('read').execute(`
      SELECT SUM(rr.value_uba) as totalValueUBA
      FROM redemption_requested rr
      INNER JOIN redemption_default rd ON rd.redemption_requested_request_id = rr.request_id
    `)
    return result[0].totalValueUBA
  }

  async totalRedemptionRequesters(unique: boolean): Promise<number> {
    const qb = this.context.orm.em.qb(RedemptionRequested, 'o')
    const result = await qb.count('o.redeemer', unique).execute()
    return result[0].count
  }

  async totalCollateralReservers(unique: boolean): Promise<number> {
    const qb = this.context.orm.em.qb(CollateralReserved, 'o')
    const result = await qb.count('o.minter', unique).execute()
    return result[0].count
  }
}
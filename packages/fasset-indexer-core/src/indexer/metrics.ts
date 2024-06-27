import { getVar } from "../database/utils"
import { CollateralReserved, MintingExecuted } from "../database/entities/events/minting"
import { RedemptionRequested } from "../database/entities/events/redemption"
import { Context } from "../context"
import { config } from "../config"
import { FIRST_UNHANDLED_EVENT_BLOCK } from "../constants"


export class EventMetrics {

  constructor(public readonly context: Context) {}

  async unhandledMintings(): Promise<number> {
    const qb = this.context.orm.em.qb(MintingExecuted, 'o')
    qb.select('o').where({ poolFeeUBA: null })
    const result = await qb.count('o', true).execute()
    return result[0].count
  }

  ///////////////////////////////////////////////////////////////
  // metadata

  async currentBlock(): Promise<number | null> {
    const v = await getVar(this.context.orm.em.fork(), FIRST_UNHANDLED_EVENT_BLOCK)
    return (v && v.value) ? parseInt(v.value) : null
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

  async redemptionRequestFromSecondsAgo(seconds: number): Promise<number> {
    const timestamp = Date.now() / 1000 - seconds
    const result = await this.context.orm.em.getConnection('read').execute(`
      SELECT COUNT(rr.request_id) AS count
      FROM redemption_requested rr
      INNER JOIN evm_log el
      ON rr.evm_log_id = el.id
      WHERE el.timestamp >= ${timestamp}
    `)
    return result[0].count
  }
}


async function main() {
  const context = await Context.create(config)
  const metrics = new EventMetrics(context)
  console.log(await metrics.redemptionRequestFromSecondsAgo(60 * 60))
}

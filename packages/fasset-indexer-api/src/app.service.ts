import { Injectable, Inject } from '@nestjs/common'
import { EventMetrics, type Context } from 'fasset-indexer-core'


@Injectable()
export class FAssetIndexerService extends EventMetrics {

  constructor(@Inject('METRICS') context: Context) {
    super(context)
  }
}
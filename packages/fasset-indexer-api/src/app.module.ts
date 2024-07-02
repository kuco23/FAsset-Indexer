import { Module } from '@nestjs/common'
import { FAssetIndexerService } from './app.service'
import { FAssetIndexerController } from './app.controller'
import { config, createOrm } from 'fasset-indexer-core'


const fAssetIndexerServiceProvider = {
  provide: FAssetIndexerService,
  useFactory: async () => {
    const orm = await createOrm(config.db, 'safe')
    return new FAssetIndexerService(orm)
  }
}

@Module({
  imports: [],
  controllers: [FAssetIndexerController],
  providers: [fAssetIndexerServiceProvider]
})
export class FAssetIndexerModule {}

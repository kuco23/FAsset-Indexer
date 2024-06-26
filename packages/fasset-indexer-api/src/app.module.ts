import { Module } from '@nestjs/common'
import { FAssetIndexerService } from './app.service';
import { FAssetIndexerController } from './app.controller'
import { config, Context } from 'fasset-indexer-core';


const fAssetIndexerServiceProvider = {
  provide: FAssetIndexerService,
  useFactory: async () => {
    const context = await Context.create(config)
    return new FAssetIndexerService(context)
  }
}

@Module({
  imports: [],
  controllers: [FAssetIndexerController],
  providers: [fAssetIndexerServiceProvider]
})
export class FAssetIndexerModule {}

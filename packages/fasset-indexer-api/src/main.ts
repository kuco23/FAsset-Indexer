import { NestFactory } from '@nestjs/core';
import { FAssetIndexerModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(FAssetIndexerModule)
  const config = new DocumentBuilder()
    .setTitle('FAsset Indexer')
    .setDescription('Indexer for the FAsset protocol')
    .setVersion('1.0')
    .addTag('minting')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000)
}

bootstrap()

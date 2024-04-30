import { NestFactory } from '@nestjs/core';
import { AppWithoutConfigModule } from './app.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERBOOK_API_PACKAGE_NAME } from './__generated__/orderbook';
import { join, resolve } from 'path';

@Module({
  imports: [ConfigModule.forRoot({}), AppWithoutConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}

async function bootstrap() {
  const logger = new Logger('bootstrap()');

  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.getOrThrow<number>('ORDERBOOK_PORT');
  const grpcPort = config.getOrThrow<string>('ORDERBOOK_GRPC_PORT');
  const protoPath = join(resolve(), './api/orderbook.proto');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${grpcPort}`,
      package: ORDERBOOK_API_PACKAGE_NAME,
      protoPath: protoPath,
      loader: {
        keepCase: true,
      },
    },
  });

  app.enableShutdownHooks();

  logger.log(`Starting GRPC endpoint [${grpcPort}]...`);
  await app.startAllMicroservices();

  logger.log(`Starting HTTP service [${port}]...`);
  await app.listen(port, '0.0.0.0');
}

bootstrap().then();

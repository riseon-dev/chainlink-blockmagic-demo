import { NestFactory } from '@nestjs/core';
import { AppWithoutConfigModule } from './app.module';
import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

@Module({
  imports: [ConfigModule.forRoot({}), AppWithoutConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}

async function bootstrap() {
  const logger = new Logger('bootstrap()');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get<ConfigService>(ConfigService);
  const port = config.getOrThrow<number>('AUTH_PORT');

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  logger.log(`Starting HTTP service [${port}]...`);
  await app.listen(port, '0.0.0.0');
}

bootstrap().then();

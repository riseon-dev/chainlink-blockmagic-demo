import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DemoDataService } from './demo-data.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const demoDataService = app.get(DemoDataService);
  await demoDataService.run();
  await app.close();
}
bootstrap().then(
  () => {},
  () => {},
);

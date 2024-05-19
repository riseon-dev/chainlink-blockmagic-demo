import { Module } from '@nestjs/common';
import { WebControllersModule } from './infra/ports/web/web-controllers.module';

@Module({
  imports: [WebControllersModule],
  providers: [],
  controllers: [],
})
export class AppWithoutConfigModule {}

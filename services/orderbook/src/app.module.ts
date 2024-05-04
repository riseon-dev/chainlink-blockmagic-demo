import { Module } from '@nestjs/common';
import { WebControllersModule } from './infra/ports/web/web-controllers.module';
import { WsModule } from './infra/ports/ws/ws.module';

@Module({
  imports: [WebControllersModule, WsModule],
  providers: [],
  controllers: [],
})
export class AppWithoutConfigModule {}

import { Module } from '@nestjs/common';
import { OrdersWorkfow } from './orders.workfow';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule],
  providers: [OrdersWorkfow],
  controllers: [],
  exports: [OrdersWorkfow],
})
export class WorkflowsModule {}

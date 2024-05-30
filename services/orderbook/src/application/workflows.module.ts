import { Module } from '@nestjs/common';
import { OrdersWorkfow } from './orders.workfow';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TradeLogWorkflow } from './trade-log.workflow';

@Module({
  imports: [EventEmitterModule],
  providers: [OrdersWorkfow, TradeLogWorkflow],
  controllers: [],
  exports: [OrdersWorkfow, TradeLogWorkflow],
})
export class WorkflowsModule {}

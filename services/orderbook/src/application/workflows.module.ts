import { Module } from '@nestjs/common';
import { OrdersWorkfow } from './orders.workfow';

@Module({
  providers: [OrdersWorkfow],
  controllers: [],
  exports: [OrdersWorkfow],
})
export class WorkflowsModule {}

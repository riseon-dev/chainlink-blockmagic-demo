import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { WorkflowsModule } from '../../../application/workflows.module';
import { TradeLogController } from './trade-log/trade-log.controller';

@Module({
  imports: [WorkflowsModule],
  providers: [],
  exports: [],
  controllers: [OrderController, TradeLogController],
})
export class WebControllersModule {}

import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { WorkflowsModule } from '../../../application/workflows.module';

@Module({
  imports: [WorkflowsModule],
  providers: [],
  exports: [],
  controllers: [OrderController],
})
export class WebControllersModule {}

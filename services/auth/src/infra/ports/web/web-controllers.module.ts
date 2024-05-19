import { Module } from '@nestjs/common';
import { WorkflowsModule } from '../../../application/workflows.module';

@Module({
  imports: [WorkflowsModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class WebControllersModule {}

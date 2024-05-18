import { Module } from '@nestjs/common';
import { DemoDataService } from './demo-data.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [DemoDataService],
})
export class AppModule {}

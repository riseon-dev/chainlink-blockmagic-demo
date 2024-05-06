import { Module } from '@nestjs/common';
import { WorkflowsModule } from '../../../application/workflows.module';
import { WsGateway } from './ws.gateway';
import { TradeAdapter } from './trade.adapter';
import { TickerAdapter } from './ticker.adapter';
import { OhlcAdapter } from './ohlc.adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [WorkflowsModule, EventEmitterModule],
  providers: [WsGateway, TradeAdapter, TickerAdapter, OhlcAdapter],
})
export class WsModule {}

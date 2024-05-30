import { EventType, TradeEvent } from '../domain/events';
import { OnEvent } from '@nestjs/event-emitter';
import { Heap } from 'heap-js';

export type Trade = {
  tradeId: number;
  timestamp: number;
  symbol: string;
  price: number;
  quantity: number;
};

export class TradeLogWorkflow {
  private lastTradeId: number = Date.now();
  private tradeLog: Heap<Trade> = new Heap<Trade>(
    (a, b) => a.tradeId - b.tradeId,
  );

  constructor() {}

  private getTradeId(): number {
    return this.lastTradeId++;
  }

  @OnEvent(EventType.TRADE)
  private logTradeEvent(event: TradeEvent) {
    this.tradeLog.push({
      tradeId: this.getTradeId(),
      timestamp: event.timestamp,
      symbol: event.symbol,
      price: event.price,
      quantity: event.quantity,
    });
  }

  getTradeLog(offset = 0, limit = 10): Trade[] {
    return this.tradeLog
      .clone()
      .toArray()
      .slice(offset, offset + limit);
  }
}

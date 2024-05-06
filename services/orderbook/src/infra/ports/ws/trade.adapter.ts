import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsAdapter } from './ws.adapter';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent, EventType } from '../../../domain/events';
import { WsEvent } from './websocket.types';

@Injectable()
export class TradeAdapter extends WsAdapter implements OnModuleInit {
  constructor() {
    super();
  }

  onModuleInit() {
    this.logger.debug('TradeAdapter initialized');
  }

  @OnEvent(EventType.TRADE) // @OnEvent('trade', { async : true })
  handleTradeEvent(event: DomainEvent) {
    this.logger.debug(
      `TradeAdapter:handleTradeEvent: ${JSON.stringify(event)}`,
    );

    if (!event.symbol) {
      this.logger.debug(
        `TradeAdapter:handleTradeEvent: no symbol ${JSON.stringify(event)}`,
      );
      return;
    }

    const clients = this.pairToClient.get(event.symbol);
    console.log('clients', clients);
    if (!clients) {
      this.logger.debug(
        `TradeAdapter:handleTradeEvent: no clients for ${event.symbol}`,
      );
      return;
    }

    clients.forEach((clientId) => {
      const client = this.clientList.get(clientId);
      if (client) {
        const message: WsEvent = {
          event: 'trade',
          data: [
            {
              symbol: event.symbol || '',
              ts: event.timestamp,
              type: 'update',
              tradePrice: event?.price?.toString() || '',
              tradeVolume: event?.quantity?.toString() || '',
              tradeSide: event?.side,
            },
          ],
        };
        this.logger.debug(
          `emitting from trade-adapter: ${JSON.stringify(message)}`,
        );

        client.emit('message', JSON.stringify(message));
      }
    });
  }
}

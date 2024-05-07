import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsAdapter } from './ws.adapter';
import { OnEvent } from '@nestjs/event-emitter';
import { EventType, TickerEvent } from '../../../domain/events';
import { WsEvent } from './websocket.types';

@Injectable()
export class TickerAdapter extends WsAdapter implements OnModuleInit {
  constructor() {
    super();
  }

  onModuleInit() {
    this.logger.debug('TickerAdapter initialized');
  }

  @OnEvent(EventType.TICKER) // @OnEvent('trade', { async : true })
  handleTickerEvent(event: TickerEvent) {
    const clients = this.pairToClient.get(event.symbol);
    if (!clients) {
      return;
    }

    clients.forEach((clientId) => {
      const client = this.clientList.get(clientId);
      if (client) {
        const message: WsEvent = {
          event: 'ticker',
          data: [
            {
              symbol: event.symbol || '',
              ts: event.timestamp,
              type: 'update',
              bestBid: event.bestBid?.toString() || '',
              bestAsk: event.bestAsk?.toString() || '',
              bestBidSize: event.bestBidSize?.toString() || '',
              bestAskSize: event.bestAskSize?.toString() || '',
              baseVolume: event.baseVolume?.toString() || '',
              quoteVolume: event.quoteVolume?.toString() || '',
            },
          ],
        };

        client.emit('message', JSON.stringify(message));
      }
    });
  }
}

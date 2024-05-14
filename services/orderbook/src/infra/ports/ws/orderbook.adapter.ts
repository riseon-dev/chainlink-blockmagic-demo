import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsAdapter } from './ws.adapter';
import { OnEvent } from '@nestjs/event-emitter';
import { EventType, OrderbookEvent } from '../../../domain/events';
import { OrderbookWsEvent } from '@haru/shared-interfaces';

@Injectable()
export class OrderbookAdapter extends WsAdapter implements OnModuleInit {
  constructor() {
    super();
  }

  onModuleInit() {
    this.logger.debug('OrderbookAdapter initialized');
  }

  @OnEvent(EventType.ORDERBOOK) // @OnEvent('trade', { async : true })
  handleOrderbookEvent(event: OrderbookEvent) {
    const clients = this.pairToClient.get(event.symbol);
    if (!clients) {
      return;
    }

    clients.forEach((clientId) => {
      const client = this.clientList.get(clientId);
      if (client) {
        const message: OrderbookWsEvent = {
          event: 'orderbook',
          data: [
            {
              symbol: event.symbol || '',
              ts: event.timestamp,
              type: 'update',
              asks: event.asks.map((value) => [
                value[0].toString(),
                value[1].toString(),
              ]),
              bids: event.bids.map((value) => [
                value[0].toString(),
                value[1].toString(),
              ]),
            },
          ],
        };

        client.emit('message', JSON.stringify(message));
      }
    });
  }
}

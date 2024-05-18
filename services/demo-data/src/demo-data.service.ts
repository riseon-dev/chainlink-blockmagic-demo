import { Injectable, Logger } from '@nestjs/common';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { firstValueFrom, from, skip, startWith, tap } from 'rxjs';
import { KrakenWebsocketMessage } from './kraken.types';
import { HttpService } from '@nestjs/axios';
import { OrderbookPlaceOrderDto } from '@haru/shared-interfaces';
import { OrderbookPlaceOrderResponse } from '@haru/shared-interfaces/dist/src';

(global as any).WebSocket = require('ws');

type OrderbookUpdate = {
  a?: [
    string, // price
    string, // volume
    string, // timestamp;
  ][];
  b?: [
    string, // price
    string, // volume
    string, // timestamp;
  ][];
};

@Injectable()
export class DemoDataService {
  private logger: Logger = new Logger(DemoDataService.name);

  private KRAKEN_WEBSOCKET_URL = 'wss://ws.kraken.com/';
  private localExchangeUrl = `http://localhost:${process.env.ORDERBOOK_PORT}`;

  constructor(private readonly httpService: HttpService) {}

  subscribeToOrderbook(symbols: string[], socket: WebSocketSubject<unknown>) {
    const subscribeMessage: KrakenWebsocketMessage = {
      event: 'subscribe',
      pair: symbols,
      subscription: {
        name: 'book',
      },
    };
    this.logger.debug(
      `Subscribing to ticker for ${JSON.stringify(subscribeMessage)}`,
    );
    socket.next(subscribeMessage);
  }

  async placeOrder(side: 'buy' | 'sell', price: number, volume: number) {
    try {
      const order: OrderbookPlaceOrderDto = {
        symbol: 'LINK/USDT',
        side: side === 'buy' ? 'BUY' : 'SELL',
        orderType: 'LIMIT',
        quantity: volume.toString(),
        price: price.toString(),
      };

      const url = `${this.localExchangeUrl}/order/place`;

      const response = await firstValueFrom(
        this.httpService.post<OrderbookPlaceOrderResponse>(url, order),
      );
      return response.data;
    } catch (error) {
      console.log(error?.code, error?.response?.data);
      return null;
    }
  }

  async orderProcessor(update: OrderbookUpdate) {
    try {
      if (update.a) {
        // asks (sell side)
        for (const ask of update.a) {
          const [_price, _volume] = ask;
          const price = Number(_price).toFixed(4);
          const volume = Number(_volume).toFixed(4);
          if (+volume < 0.0001) return;

          return this.placeOrder('sell', +price, +volume);
        }
      }
      if (update.b) {
        // bids (buy side)
        for (const bid of update.b) {
          const [_price, _volume] = bid;
          const price = Number(_price).toFixed(4);
          const volume = Number(_volume).toFixed(4);
          if (+volume < 0.0001) return;

          return this.placeOrder('buy', +price, +volume);
        }
      }
      return null;
    } catch (error) {
      console.log(error?.code, error?.response?.data);
      return null;
    }
  }

  async run(): Promise<string> {
    const subject = webSocket(this.KRAKEN_WEBSOCKET_URL);

    subject
      .pipe(
        startWith(
          (() => {
            this.subscribeToOrderbook(['LINK/USDT'], subject);
            return null;
          })(),
        ),
        skip(1),
        tap((message) => {
          if (Array.isArray(message)) {
            // update message feed to order processor
            from(this.orderProcessor(message[1]));
          }
          return null;
        }),
      )
      .subscribe({
        error: (error) => {
          this.logger.error('Error');
          console.log(error);
        },
        complete: () => {
          this.logger.error('Connection closed');
        },
      });

    return 'Done!';
  }
}

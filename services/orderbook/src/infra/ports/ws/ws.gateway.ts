import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { env } from 'process';
import { OrderbookWsEvent } from '@haru/shared-interfaces';
import { TradeAdapter } from './trade.adapter';
import { TickerAdapter } from './ticker.adapter';
import { OrderbookAdapter } from './orderbook.adapter';

@WebSocketGateway(env.ORDERBOOK_WS_PORT ? +env.ORDERBOOK_WS_PORT : 4002, {
  path: '/',
  serveClient: false,
  cors: {
    origin: '*',
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  logger: Logger = new Logger(WsGateway.name);
  connectedClients: Map<string, Socket> = new Map();
  pongUpdates: Map<string, number> = new Map();

  constructor(
    private readonly tradeAdapter: TradeAdapter,
    private readonly tickerAdapter: TickerAdapter,
    private readonly orderbookAdapter: OrderbookAdapter,
  ) {}

  afterInit() {
    this.logger.log(
      `Starting socket.io server [port: ${env.ORDERBOOK_WS_PORT}]...`,
    );

    // send heartbeats every 10 sec
    //this.heartbeatInit();

    // send ping every 1 minute
    //this.pingInit();
  }

  heartbeatInit() {
    setInterval(() => {
      const message = JSON.stringify({
        event: 'heartbeat',
      });
      this.connectedClients.forEach((client) => {
        client.emit('message', message);
      });
    }, 10000);
  }

  pingInit() {
    setInterval(() => {
      const message = JSON.stringify({
        event: 'ping',
      });
      this.connectedClients.forEach((client) => {
        client.emit('message', message);
      });
    }, 60000);

    setInterval(() => {
      this.connectedClients.forEach((client) => {
        const lastPong = this.pongUpdates.get(client.id) ?? 0;
        if (Date.now() - lastPong > 30000) {
          client.disconnect();
        }
      });
    }, 90000);
  }

  handleConnection(client: Socket) {
    //console.log(JSON.stringify(client));
    this.logger.log(`connected... id: ${client.id}`);

    this.connectedClients.set(client.id, client);
    this.pongUpdates.set(client.id, Date.now());
    //client.emit('events', 'hello?');
    // this.server.emit('events', 'hello?');
    // this.server.emit(
    //   JSON.stringify({ event: 'events', data: 'server-emit-stringify-test' }),
    // );
    // client.emit({ event: 'events', data: 'client-emit-test' });
    // client.emit(
    //   JSON.stringify({ event: 'events', data: 'client-emit-stringify-test' }),
    // );
    // return { event: 'events', data: 'returned-data' };
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnect... id: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('message')
  onMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const message = JSON.parse(data) as OrderbookWsEvent;
    if (message.event === 'pong') {
      this.logger.debug(`Pong received from ${client.id}`);
      this.pongUpdates.set(client.id, Date.now());
    }

    if (message.event === 'ping') {
      this.logger.debug(`Ping received from ${client.id}`);
      client.emit('message', JSON.stringify({ event: 'pong' }));
    }

    if (message.event === 'subscribe') {
      if (!message.pairs || message.pairs.length === 0) {
        client.emit('message', {
          event: 'subscribe',
          code: '10002',
          msg: 'pair details required',
        });
        return;
      }

      if (!message.subscription || !message.subscription.name) {
        client.emit('message', {
          event: 'subscribe',
          code: '10001',
          msg: 'subscription details required',
        });
        return;
      }

      this.logger.debug(
        `Subscription request received from ${client.id} for "${message.subscription.name}"`,
      );

      if (message.subscription.name === 'trade') {
        this.tradeAdapter.subscribe(
          message.pairs,
          message.subscription,
          client,
        );
      }

      if (message.subscription.name === 'ticker') {
        this.tickerAdapter.subscribe(
          message.pairs,
          message.subscription,
          client,
        );
      }

      if (message.subscription.name === 'orderbook') {
        this.orderbookAdapter.subscribe(
          message.pairs,
          message.subscription,
          client,
        );
      }
    }

    if (message.event === 'unsubscribe') {
      if (!message.pairs || message.pairs.length === 0) {
        client.emit('message', {
          event: 'unsubscribe',
          code: '10002',
          msg: 'pair details required',
        });
        return;
      }

      if (!message.subscription || !message.subscription.name) {
        client.emit('message', {
          event: 'unsubscribe',
          code: '10001',
          msg: 'subscription details required',
        });
        return;
      }

      this.logger.debug(
        `Unsubscription request received from ${client.id} for "${message.subscription.name}"`,
      );

      if (message.subscription.name === 'trade') {
        this.tradeAdapter.unsubscribe(
          message.pairs,
          message.subscription,
          client.id,
        );
      }

      if (message.subscription.name === 'ticker') {
        this.tickerAdapter.unsubscribe(
          message.pairs,
          message.subscription,
          client.id,
        );
      }

      if (message.subscription.name === 'orderbook') {
        this.orderbookAdapter.unsubscribe(
          message.pairs,
          message.subscription,
          client.id,
        );
      }
    }
  }
}

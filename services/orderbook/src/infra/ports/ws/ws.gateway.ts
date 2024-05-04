import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { env } from 'process';
import { WsEvent } from './websocket.types';

@WebSocketGateway(env.ORDERBOOK_WS_PORT ? +env.ORDERBOOK_WS_PORT : 4002, {
  path: '/',
  serveClient: false,
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  logger: Logger = new Logger(WsGateway.name);
  connectedClients: Map<string, Socket> = new Map();
  pongUpdates: Map<string, number> = new Map();

  afterInit() {
    this.logger.log(
      `Starting socket.io server [port: ${env.ORDERBOOK_WS_PORT}]...`,
    );

    // send heartbeats every 1 sec
    //this.heartbeatInit();

    // send ping every 5 sec
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
    }, 1000);
  }

  pingInit() {
    setInterval(() => {
      const message = JSON.stringify({
        event: 'ping',
      });
      this.connectedClients.forEach((client) => {
        client.emit('message', message);
      });
    }, 15000);

    setInterval(() => {
      this.connectedClients.forEach((client) => {
        const lastPong = this.pongUpdates.get(client.id) ?? 0;
        if (Date.now() - lastPong > 20000) {
          client.disconnect();
        }
      });
    }, 20000);
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
  ): WsResponse<string> {
    const message = JSON.parse(data) as WsEvent;
    if (message.event === 'pong') {
      this.logger.debug(`Pong received from ${client.id}`);
      this.pongUpdates.set(client.id, Date.now());
    }

    if (message.event === 'ping') {
      this.logger.debug(`Ping received from ${client.id}`);
      client.emit('message', JSON.stringify({ event: 'pong' }));
    }

    // validate message structure
    // pass messages to socket handler

    const event = 'events';
    const response = `events-xxx`;
    return { event, data: response };
  }
}

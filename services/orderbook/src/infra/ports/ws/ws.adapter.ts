import { Socket } from 'socket.io';
import { OrderbookWsSubscription } from '@haru/shared-interfaces';
import { Logger } from '@nestjs/common';

export abstract class WsAdapter {
  protected clientList: Map<string, Socket> = new Map();
  protected pairToClient: Map<string, string[]> = new Map();
  protected logger: Logger = new Logger(WsAdapter.name);

  constructor() {}

  subscribe(
    pairs: string[],
    subscription: OrderbookWsSubscription,
    client: Socket,
  ): void {
    this.clientList.set(client.id, client);
    pairs.forEach((pair) => {
      if (this.pairToClient.has(pair)) {
        const clients = this.pairToClient.get(pair);
        if (!clients) {
          const clients = [client.id];
          this.pairToClient.set(pair, clients);
        }
        if (clients && !clients.includes(client.id)) {
          clients.push(client.id);
        }
      } else {
        this.pairToClient.set(pair, [client.id]);
      }
    });

    this.logger.debug(`Client ${client.id} subscribed to ${pairs.join(', ')}`);
  }

  unsubscribe(
    pairs: string[],
    subscription: OrderbookWsSubscription,
    clientId: string,
  ): void {
    pairs.forEach((pair) => {
      if (this.pairToClient.has(pair)) {
        const clients = this.pairToClient.get(pair);
        if (clients) {
          const index = clients.indexOf(clientId);
          if (index > -1) {
            clients.splice(index, 1);
          }
        }
      }
    });
    this.clientList.delete(clientId);
    this.logger.debug(
      `Client ${clientId} unsubscribed from ${pairs.join(', ')}`,
    );
  }
}

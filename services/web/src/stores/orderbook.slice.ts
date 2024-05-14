import { StateCreator } from 'zustand'
import { OrderbookWsData, OrderbookWsEvent } from '@haru/shared-interfaces';
import { io } from "socket.io-client";

export interface OrderbookSlice {
  connect: () => void;
  orderbook: Pick<OrderbookWsData, 'asks' | 'bids'>;
}

export const createOrderbookSlice: StateCreator<
  OrderbookSlice ,
  [],
  [],
  OrderbookSlice
> = (set) => ({
  connect: () => {
    console.log('inside connection function');
    const socket = io('http://localhost:4002');

    socket.on('connect', () => {
      console.log('socket.io connected');

      const subscriptionMessage: OrderbookWsEvent = {
        event: 'subscribe',

        pairs: ['LINK/USDT'],
        subscription: {
          name: 'orderbook',
        },
      }

      socket.send(JSON.stringify(subscriptionMessage));
    });
    socket.on('message', (event: string) => {
      const message = JSON.parse(event) as OrderbookWsEvent;
      console.log(`socket.io message: ${JSON.stringify(message)}`);
      console.log(message.data);

      message?.data?.forEach((data) => {
        if (data.type === 'update') {
          set({ orderbook: data });
        }
      });
    });
    socket.on('disconnect', () => {
      console.log('socket.io disconnected');
    });
    socket.on('error', (error: unknown) => {
      console.error(error);
    });
  },
  orderbook: {
    asks: [],
    bids: [],
  }
});
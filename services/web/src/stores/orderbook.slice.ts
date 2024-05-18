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

      message?.data?.forEach((_data) => {
        const { asks, bids } = _data;
        const filteredAsks = asks ? sumVolumeByPrice(asks).slice(0, 15) : []; // TODO combine volume by price
        const filteredBids = bids ? sumVolumeByPrice(bids).slice(0, 15) : []; // TODO combine volume by price

        const data = {
          ..._data,
          asks: filteredAsks,
          bids: filteredBids,
        }
        if (_data.type === 'update') {
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


const sumVolumeByPrice = (data: [string, string][]): [string, string][] => {
  const arr: [string, string][] = [];
  for (const [price, volume] of data) {
    const existing = arr.find(([p]) => p === price);

    if (existing) {
      existing[1] = (+(existing[1]) + +(volume)).toFixed(4);
    } else {
      arr.push([price, volume]);
    }
  }
  return arr;
}
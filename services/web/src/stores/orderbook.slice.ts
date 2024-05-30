import { StateCreator } from 'zustand'
import { OrderbookWsData, OrderbookWsEvent } from '@haru/shared-interfaces';
import { io } from "socket.io-client";

const ORDERBOOK_HOST = import.meta.env.VITE_APP_ORDERBOOK_URL;

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
    const socket = io(ORDERBOOK_HOST); // FIXME

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

      message?.data?.forEach((_data) => {
        const { asks, bids } = _data;
        const filteredAsks = asks ? sumVolumeByPrice(asks).slice(0, 15) : [];
        const filteredBids = bids ? sumVolumeByPrice(bids, true).slice(0, 15) : [];

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


const sumVolumeByPrice = (data: [string, string][], reverse= true): [string, string][] => {

  const arr: [string, string][] = [];
  for (const [price, volume] of data) {
    const existing = arr.find(([p]) => p === price);

    if (existing) {
      existing[1] = (+(existing[1]) + +(volume)).toFixed(4);
    } else {
      arr.push([price, volume]);
    }
  }
  return arr.sort((a, b) => reverse ? parseFloat(a[0]) - parseFloat(b[0]) : parseFloat(b[0]) - parseFloat(a[0]));
}
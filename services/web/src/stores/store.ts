import { create } from 'zustand'
import { createOrderbookSlice, OrderbookSlice } from './orderbook.slice.ts';


export const useBoundStore = create<OrderbookSlice>()((...a) => ({
  ...createOrderbookSlice(...a),
}))
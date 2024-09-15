import { create } from "zustand";
import { createOrderbookSlice, OrderbookSlice } from "./orderbook.slice.ts";
import { createWeb3Slice, Web3Slice } from "./web3.slice.ts";

export const useBoundStore = create<OrderbookSlice & Web3Slice>()((...a) => ({
  ...createOrderbookSlice(...a),
  ...createWeb3Slice(...a),
}));

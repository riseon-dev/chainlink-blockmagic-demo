import { StateCreator } from 'zustand'

export interface OrderbookSlice {
  bears: number
  increase: (by: number) => void
}

export const createOrderbookSlice: StateCreator<
  OrderbookSlice ,
  [],
  [],
  OrderbookSlice
> = (set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
})
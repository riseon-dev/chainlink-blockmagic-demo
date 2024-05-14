import React from 'react';
import { useBoundStore } from '../../stores/store.ts';

const Orderbook = () => {
  const connect = useBoundStore((state) => state.connect);
  const orderbook = useBoundStore((state) => state.orderbook);

  React.useEffect(() => {
    console.log('calling connect');
    connect();
  }, []);

  return (
    <div>
      Orderbook
      asks: {JSON.stringify(orderbook.asks)}
      bids: {JSON.stringify(orderbook.bids)}
    </div>
  );
};

export default Orderbook;
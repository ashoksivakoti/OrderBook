import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const OrderBookContext = createContext();

export const OrderBookProvider = ({ children }) => {
  const [krakenBuyers, setKrakenBuyers] = useState([]);
  const [krakenSellers, setKrakenSellers] = useState([]);
  const [binanceBuyers, setBinanceBuyers] = useState([]);
  const [binanceSellers, setBinanceSellers] = useState([]);

  return (
    <OrderBookContext.Provider
      value={{
        krakenBuyers,
        setKrakenBuyers,
        krakenSellers,
        setKrakenSellers,
        binanceBuyers,
        setBinanceBuyers,
        binanceSellers,
        setBinanceSellers,
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export const useOrderBook = () => {
  return useContext(OrderBookContext);
};

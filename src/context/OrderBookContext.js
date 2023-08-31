import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderBookContext = createContext();

export const OrderBookProvider = ({ children }) => {
  const [krakenBuyers, setKrakenBuyers] = useState([]);
  const [krakenSellers, setKrakenSellers] = useState([]);
  const [binanceBuyers, setBinanceBuyers] = useState([]);
  const [binanceSellers, setBinanceSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


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
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export const useOrderBook = () => {
  return useContext(OrderBookContext);
};

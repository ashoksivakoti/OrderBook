import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderBookContext = createContext();

export const OrderBookProvider = ({ children }) => {
  const [krakenBuyers, setKrakenBuyers] = useState([]);
  const [krakenSellers, setKrakenSellers] = useState([]);
  const [binanceBuyers, setBinanceBuyers] = useState([]);
  const [binanceSellers, setBinanceSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [intersection,setIntersection] = useState([])
  const [bSymbols, setBsymbols] = useState([]);
  const [kSymbols, setKsymbols] = useState([]);
useEffect(() => {
    getSymbols();
    fetchSymbols();
  }, []);

  useEffect(() => {
    const newIntersection = kSymbols.filter(symbol => bSymbols.includes(symbol));
    setIntersection(newIntersection);
  }, [bSymbols, kSymbols]);

  const getSymbols = async () => {
    try {
      const res = await axios.get(`https://api.binance.com/api/v1/exchangeInfo`);
      const symbolsarray = res.data.symbols.map(item => item.symbol);
      setBsymbols(symbolsarray);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSymbols = async () => {
    try {
      const response = await axios.get('https://api.kraken.com/0/public/AssetPairs');
      const pairs = Object.keys(response.data.result)
        .filter(symbol => response.data.result[symbol].wsname)
        .map(symbol => response.data.result[symbol].wsname.replace('/', ''));
      setKsymbols(pairs);
    } catch (error) {
      console.error(error);
    }
  };

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
        setSearchQuery,
        intersection
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export const useOrderBook = () => {
  return useContext(OrderBookContext);
};

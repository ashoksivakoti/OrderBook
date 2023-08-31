import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderBookContext = createContext();

export const OrderBookProvider = ({ children }) => {
  const [krakenBuyers, setKrakenBuyers] = useState([]);
  const [krakenSellers, setKrakenSellers] = useState([]);
  const [binanceBuyers, setBinanceBuyers] = useState([]);
  const [binanceSellers, setBinanceSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [binanceSocket, setBinanceSocket] = useState(null);
  const [krakenSocket, setKrakenSocket] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
        setBinanceBuyers([])
        setBinanceSellers([])
        setKrakenBuyers([]);
        setKrakenSellers([]);
        const formattedQuery = searchQuery.replace('/', '').toLowerCase();
      connectBinanceSocket(formattedQuery);
      connectKrakenSocket(searchQuery);
    } else {
        setBinanceBuyers([]);
        setBinanceSellers([]);
        setKrakenBuyers([]);
        setKrakenSellers([]);
      setError(null);
      if (binanceSocket && krakenSocket) {
        binanceSocket.close();
        krakenSocket.close()
      }
    }
    return () => {
        closeBinanceSocket();
        closeKrakenSocket();
      };
  }, [searchQuery]);

  const closeBinanceSocket = () => {
    if (binanceSocket) {
      binanceSocket.close();
    }
  };

  const connectBinanceSocket = (pair) => {
    closeBinanceSocket();

    const newSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@depth10`
    );
    
    newSocket.onopen = () => {
        setBinanceSocket(newSocket)
    }

    newSocket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
      setBinanceBuyers(parsedMessage.bids);
      setBinanceSellers(parsedMessage.asks);
    };

  };

  const closeKrakenSocket = () => {
    if (krakenSocket) {
      krakenSocket.close();
    }
  };

  const connectKrakenSocket = (pair) => {
    closeKrakenSocket()

    const newKrakenSocket = new WebSocket('wss://ws.kraken.com');

    newKrakenSocket.onopen = () => {
      newKrakenSocket.send(
        JSON.stringify({
          event: 'subscribe',
          pair: [pair.toUpperCase()],
          subscription: {
            name: 'book',
            depth: 100,
          },
        })
      );
      setKrakenSocket(newKrakenSocket)
    };

    newKrakenSocket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.event === 'heartbeat') {
        return;
      }

      if (Array.isArray(data)) {
        const [channelID, updates, channelName, pair] = data;

        if (channelName === 'book-100' && updates) {
          const updatedBuyers = updates.b || [];
          const updatedSellers = updates.a || [];

          setKrakenBuyers(prevBuyers => updateOrderBook(prevBuyers, updatedBuyers));
          setKrakenSellers(prevSellers => updateOrderBook(prevSellers, updatedSellers));

        }
    }
};
  };

  const updateOrderBook = (prevOrderBook, newEntries) => {
    const updatedOrderBook = [...prevOrderBook];

    for (const entry of newEntries) {
      const [price, qty] = entry;
      const index = updatedOrderBook.findIndex(item => item[0] === price);

      if (index !== -1) {
        if (qty === '0.00000000') {
          updatedOrderBook.splice(index, 1);
        } else {
          updatedOrderBook[index] = entry;
        }
      } else {
        if (qty !== '0.00000000') {
          updatedOrderBook.push(entry);
        }
      }
    }

    return updatedOrderBook
      .sort((a, b) => a[0] - b[0])
      .slice(0, 10);
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
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export const useOrderBook = () => {
  return useContext(OrderBookContext);
};

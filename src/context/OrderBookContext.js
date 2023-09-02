import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create an OrderBook context
const OrderBookContext = createContext();

// Create an OrderBookProvider component
export const OrderBookProvider = ({ children }) => {
  const [krakenBuyers, setKrakenBuyers] = useState([]);
  const [krakenSellers, setKrakenSellers] = useState([]);
  const [binanceBuyers, setBinanceBuyers] = useState([]);
  const [binanceSellers, setBinanceSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [binanceSocket, setBinanceSocket] = useState(null);
  const [krakenSocket, setKrakenSocket] = useState(null);
  const [error, setError] = useState(null);
  const [selectedExchanges, setSelectedExchanges] = useState([]);

  const [isBinanceConnected, setIsBinanceConnected] = useState(false);
  const [isKrakenConnected, setIsKrakenConnected] = useState(false);

  // Effect to handle search and WebSocket connections
  useEffect(() => {
    if (searchQuery) {
      setBinanceBuyers([]);
      setBinanceSellers([]);
      setKrakenBuyers([]);
      setKrakenSellers([]);
      const formattedQuery = searchQuery.replace("/", "").toLowerCase();

      if (isBinanceConnected && selectedExchanges.includes("binance")) {
        connectBinanceSocket(formattedQuery);
      }
      if (isKrakenConnected && selectedExchanges.includes("kraken")) {
        connectKrakenSocket(searchQuery);
      }
    } else {
      setBinanceBuyers([]);
      setBinanceSellers([]);
      setKrakenBuyers([]);
      setKrakenSellers([]);
      setError(null);
      if (binanceSocket) {
        binanceSocket.close();
      }
      if (krakenSocket) {
        krakenSocket.close();
      }
    }
    return () => {
      // Clean up WebSocket connections when unmounting
      closeBinanceSocket();
      closeKrakenSocket();
    };
  }, [searchQuery, isBinanceConnected, isKrakenConnected]);

  // Function to close WebSocket connections
  const closeBinanceSocket = () => {
    if (binanceSocket) {
      binanceSocket.close();
      setBinanceSocket(null);
    }
  };

  // Functions to toggle WebSocket connections
  const toggleBinanceWebSocket = (open) => {
    setIsBinanceConnected(open);
    if (!open && binanceSocket) {
      closeBinanceSocket();
    }
  };

  const toggleKrakenWebSocket = (open) => {
    setIsKrakenConnected(open);
    if (!open && krakenSocket) {
      closeKrakenSocket();
    }
  };

  // Function to connect to WebSocket for Binance
  const connectBinanceSocket = (pair) => {
    closeBinanceSocket();

    const newSocket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@depth10`
    );

    newSocket.onopen = () => {
      setBinanceSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      setBinanceBuyers(parsedMessage.bids);
      setBinanceSellers(parsedMessage.asks);
    };
  };

  const closeKrakenSocket = () => {
    if (krakenSocket) {
      krakenSocket.close();
      setKrakenSocket(null);
    }
  };

  // function to connect to websocket for kraken
  const connectKrakenSocket = (pair) => {
    closeKrakenSocket();

    const newKrakenSocket = new WebSocket("wss://ws.kraken.com");

    newKrakenSocket.onopen = () => {
      newKrakenSocket.send(
        JSON.stringify({
          event: "subscribe",
          pair: [pair.toUpperCase()],
          subscription: {
            name: "book",
            depth: 100,
          },
        })
      );
      setKrakenSocket(newKrakenSocket);
    };

    newKrakenSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "heartbeat") {
        return;
      }

      if (Array.isArray(data)) {
        const [channelID, updates, channelName, pair] = data;

        if (channelName === "book-100" && updates) {
          const updatedBuyers = updates.b || [];
          const updatedSellers = updates.a || [];

          setKrakenBuyers((prevBuyers) =>
            updateOrderBook(prevBuyers, updatedBuyers)
          );
          setKrakenSellers((prevSellers) =>
            updateOrderBook(prevSellers, updatedSellers)
          );
        }
      }
    };
  };

  // Function to update the order book
  const updateOrderBook = (prevOrderBook, newEntries) => {
    const updatedOrderBook = [...prevOrderBook];

    for (const entry of newEntries) {
      const [price, qty] = entry;
      const index = updatedOrderBook.findIndex((item) => item[0] === price);

      if (index !== -1) {
        if (qty === "0.00000000") {
          updatedOrderBook.splice(index, 1);
        } else {
          updatedOrderBook[index] = entry;
        }
      } else {
        if (qty !== "0.00000000") {
          updatedOrderBook.push(entry);
        }
      }
    }

    return updatedOrderBook.sort((a, b) => a[0] - b[0]).slice(0, 10);
  };

  // Fetch trading symbols and determine the intersection values
  const [bSymbols, setBsymbols] = useState([]);
  const [kSymbols, setKsymbols] = useState([]);
  const [kSymbolsWithoutSlashes, setKsymbolsWithoutSlashes] = useState([]);
  const [intersectionValues, setIntersectionValues] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bSymbolsResponse, kSymbolsResponse] = await Promise.all([
          axios.get("https://api.binance.com/api/v1/exchangeInfo"),
          axios.get("https://api.kraken.com/0/public/AssetPairs"),
        ]);

        const binanceSymbols = bSymbolsResponse.data.symbols.map(
          (item) => item.symbol
        );
        const krakenPairs = Object.keys(kSymbolsResponse.data.result)
          .filter((symbol) => kSymbolsResponse.data.result[symbol].wsname)
          .map((symbol) => kSymbolsResponse.data.result[symbol].wsname);
        const krakenPairsWithoutSlashes = krakenPairs.map((pair) =>
          pair.replace("/", "")
        );

        setKsymbols(krakenPairs);
        setBsymbols(binanceSymbols);
        setKsymbolsWithoutSlashes(krakenPairsWithoutSlashes);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Create the symbol dictionary
    const dictionary = {};
    kSymbolsWithoutSlashes.forEach((symbolWithoutSlash, index) => {
      dictionary[symbolWithoutSlash] = kSymbols[index];
    });

    const intersectionKeys = Object.keys(dictionary).filter((key) =>
      bSymbols.includes(key)
    );

    // Create a new array with the values of the intersection keys
    const intersectionValues = intersectionKeys.map((key) => dictionary[key]);
    setIntersectionValues(intersectionValues);
  }, [kSymbols, bSymbols, kSymbolsWithoutSlashes]);

  // Provide the context values to the components
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
        connectBinanceSocket,
        connectKrakenSocket,
        closeBinanceSocket,
        closeKrakenSocket,
        toggleBinanceWebSocket,
        toggleKrakenWebSocket,
        intersectionValues,
        selectedExchanges,
        setSelectedExchanges,
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

// Create a custom hook to access the OrderBook context
export const useOrderBook = () => {
  return useContext(OrderBookContext);
};

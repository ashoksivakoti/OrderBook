import React, { useState, useEffect, useRef } from 'react';
import { useOrderBook } from '../context/OrderBookContext';

const Kraken = ({ searchQuery }) => {
    const { krakenBuyers, setKrakenBuyers, krakenSellers, setKrakenSellers } = useOrderBook();
  const webSocketRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
        setKrakenBuyers([]);
        setKrakenSellers([]);
      connectWebSocket(searchQuery);
    } else {
      setKrakenBuyers([]);
      setKrakenSellers([]);
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    }
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [searchQuery]);

  const connectWebSocket = () => {
    const ws = new WebSocket('wss://ws.kraken.com');
    webSocketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          event: 'subscribe',
          pair: [searchQuery.toUpperCase()],
          subscription: {
            name: 'book',
            depth: 100,
          },
        })
      );
    };

    ws.onmessage = event => {
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

    ws.onclose = () => {
      console.log('WebSocket connection closed');
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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <h2 className='text-xl font-bold text-center mb-4'>Kraken Orderbook</h2>
      <div className="grid grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Buy Orders</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Volume</th>
            </tr>
          </thead>
          <tbody>
            {krakenBuyers.map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 text-green-600">{(entry[0])}</td>
                <td className="py-2 px-4">{entry[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Sell Orders</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Volume</th>
            </tr>
          </thead>
          <tbody>
            {krakenSellers.map((entry, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 text-red-600">{(entry[0])}</td>
                <td className="py-2 px-4">{entry[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Kraken;

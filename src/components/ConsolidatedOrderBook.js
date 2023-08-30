import React from 'react';
import { useOrderBook } from '../context/OrderBookContext';

const ConsolidatedOrderBook = () => {
  const { krakenBuyers, krakenSellers, binanceBuyers, binanceSellers } = useOrderBook();

  const combineOrders = (orders1, orders2) => {
    const combinedOrders = {};

    orders1.forEach(([price, qty]) => {
        const roundedPrice = roundTo5Decimal(price);
      combinedOrders[roundedPrice] = (combinedOrders[roundedPrice] || 0) + parseFloat(qty);
    });

    orders2.forEach(([price, qty]) => {
        const roundedPrice = roundTo5Decimal(price);
      combinedOrders[roundedPrice] = (combinedOrders[roundedPrice] || 0) + parseFloat(qty);
    });

    return Object.entries(combinedOrders).map(([price, qty]) => [price, qty.toFixed(8)]);
  };

  const roundTo5Decimal = (value) => {
    return parseFloat(value).toFixed(5);
  };
    const combinedBuyers = combineOrders(krakenBuyers, binanceBuyers);
    const combinedSellers = combineOrders(krakenSellers, binanceSellers);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <h2 className='text-xl font-bold text-center mb-4'>Consolidated Data</h2>
            <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Buy Orders</h2>
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Total Volume</th>
                </tr>
              </thead>
              <tbody>
                {combinedBuyers.map((entry, index) => (
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
                  <th className="py-2 px-4 text-left">Total Volume</th>
                </tr>
              </thead>
              <tbody>
                {combinedSellers.map((entry, index) => (
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

export default ConsolidatedOrderBook;

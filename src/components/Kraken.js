import React from 'react';
import { useOrderBook } from '../context/OrderBookContext';

const Kraken = () => {
    const { krakenBuyers, krakenSellers } = useOrderBook();

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

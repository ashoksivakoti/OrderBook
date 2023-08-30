import React from 'react';

const OrderBookComparison = ({ krakenBuyers, krakenSellers, binanceBuyers, binanceSellers }) => {
    if (!krakenBuyers || !krakenSellers || !binanceBuyers || !binanceSellers) {
        // Return null or a loading indicator if the data is not available yet
        return null;
      }
  const roundTo5Decimal = value => parseFloat(value).toFixed(5);

  // Compare order book prices and sum quantities
  const combinedBuyers = [];
  const combinedSellers = [];

  for (const krakenBuyer of krakenBuyers) {
    const matchingBinanceBuyer = binanceBuyers.find(item => roundTo5Decimal(item[0]) === roundTo5Decimal(krakenBuyer[0]));
    if (matchingBinanceBuyer) {
      combinedBuyers.push([krakenBuyer[0], parseFloat(krakenBuyer[1]) + parseFloat(matchingBinanceBuyer[1])]);
    }
  }

  for (const krakenSeller of krakenSellers) {
    const matchingBinanceSeller = binanceSellers.find(item => roundTo5Decimal(item[0]) === roundTo5Decimal(krakenSeller[0]));
    if (matchingBinanceSeller) {
      combinedSellers.push([krakenSeller[0], parseFloat(krakenSeller[1]) + parseFloat(matchingBinanceSeller[1])]);
    }
  }

  // Sort and limit the combined data to 10 entries
  const topCombinedBuyers = combinedBuyers
    .sort((a, b) => b[0] - a[0]) // Sort by price in descending order
    .slice(0, 10);

  const topCombinedSellers = combinedSellers
    .sort((a, b) => a[0] - b[0]) // Sort by price in ascending order
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Combined Buyers */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="3" className="text-center">
              Combined Buyers
            </th>
          </tr>
          <tr>
            <th>Price</th>
            <th>Qty (Combined)</th>
          </tr>
        </thead>
        <tbody>
          {topCombinedBuyers.map((entry, index) => (
            <tr key={index}>
              <td>{roundTo5Decimal(entry[0])}</td>
              <td>{entry[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Combined Sellers */}
      <table className="table">
        <thead>
          <tr>
            <th colSpan="3" className="text-center">
              Combined Sellers
            </th>
          </tr>
          <tr>
            <th>Price</th>
            <th>Qty (Combined)</th>
          </tr>
        </thead>
        <tbody>
          {topCombinedSellers.map((entry, index) => (
            <tr key={index}>
              <td>{roundTo5Decimal(entry[0])}</td>
              <td>{entry[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBookComparison;

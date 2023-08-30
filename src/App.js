import React, { useEffect, useState } from 'react';
import Binance from './components/Binance';
import Kraken from './components/Kraken'; 
import ConsolidatedOrderBook from './components/ConsolidatedOrderBook';
import axios from 'axios';

const App = () => {
  const [selectedExchanges, setSelectedExchanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const handleExchangeCheckboxChange = (event) => {
    const exchange = event.target.value;
    const isSelected = event.target.checked;

    if (isSelected) {
      setSelectedExchanges((prevSelectedExchanges) => [...prevSelectedExchanges, exchange]);
    } else {
      setSelectedExchanges((prevSelectedExchanges) =>
        prevSelectedExchanges.filter((selectedExchange) => selectedExchange !== exchange)
      );
    }
  };

  const handleSearchClick = () => {
    setSearching(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(() => {
    fetchSymbolPairs()
  })
  
  const fetchSymbolPairs = () => {
    axios
      .get('https://api.kraken.com/0/public/AssetPairs')
      .then(response => {
        const suggestions = [];
        const symb = Object.keys(response.data.result);
        for (const symbol of symb) {
          if (symbol && response.data.result[symbol].wsname) {
            suggestions.push(response.data.result[symbol].wsname);
          }
        }
        setSearchSuggestions(suggestions);
      })
      .catch(error => console.error(error));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-4">Consolidated Order Book</h1>
        <div className="mb-4">
          <label>
            <input
              type="checkbox"
              value="binance"
              checked={selectedExchanges.includes('binance')}
              onChange={handleExchangeCheckboxChange}
            />
            Binance
          </label>
          <label className="ml-4">
            <input
              type="checkbox"
              value="kraken"
              checked={selectedExchanges.includes('kraken')}
              onChange={handleExchangeCheckboxChange}
            />
            Kraken
          </label>
        </div>
        <div className="flex mb-4">
        <input
  type="text"
  placeholder="Enter trading pair (ex:- xrp/eth)"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleKeyPress}
  className="border rounded p-2 flex-grow mr-2"
  list="symbolSuggestions"
/>
<datalist id="symbolSuggestions">
  {searchSuggestions.map((suggestion, index) => (
    <option key={index} value={suggestion} />
  ))}
</datalist>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
        {selectedExchanges.length === 0 && searching && (
          <p className="text-center text-red-600">Please select an exchange to view the order book.</p>
        )}
        {selectedExchanges.includes('binance') && !selectedExchanges.includes('kraken') && (
          <Binance searchQuery={searching ? searchQuery : ''} />
        )}
        {selectedExchanges.includes('kraken') && !selectedExchanges.includes('binance') && (
          <Kraken searchQuery={searching ? searchQuery : ''} />
        )}
        {selectedExchanges.includes('binance') && selectedExchanges.includes('kraken') && (
          <ConsolidatedOrderBook />
        )}
      </div>
    </>
  );
};

export default App;

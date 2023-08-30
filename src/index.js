import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { OrderBookProvider } from './context/OrderBookContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <OrderBookProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </OrderBookProvider>
);

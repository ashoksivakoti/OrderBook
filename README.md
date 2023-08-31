# Consolidated order book


A real-time order book viewer for cryptocurrency trading pairs, supporting Binance and Kraken exchanges. This application allows users to view buy and sell orders for different trading pairs and provides a consolidated view of order book data from both exchanges.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Live Demo](#live-demo)

## Features

- View real-time buy and sell orders for trading pairs on Binance and Kraken exchanges.
- Choose between individual exchange views (Binance, Kraken) or a consolidated view.
- Supports popular cryptocurrency trading pairs.
- Interactive checkboxes and search feature for easy customization.

## Installation

1. Clone the repository to your local machine:
    ```bash
   git clone https://github.com/ashoksivakoti/OrderBook.git   
2. Navigate to the project directory:
    ```bash
   cd crypto-order-book
3. Install the required dependencies:
    ```bash
   npm install
4. Start the development server:
    ```bash
   npm start
5. Open your web browser and visit http://localhost:3000 to see the app in action.

## Usage
- Select one or both of the available exchanges (Binance, Kraken) using checkboxes.
- Enter the trading pair you're interested in.
- Click the "Search" button or press Enter to view the order book data.
- The app will display the buy and sell orders for the selected trading pair and exchange(s).
- For a consolidated view, select both exchanges and view the combined order book.

## Technologies Used
- React: A JavaScript library for building user interfaces.
- WebSocket: Used for real-time data streaming from Binance and Kraken.
- Tailwind CSS: A utility-first CSS framework for styling the user interface.
- Context API: Used for state management and sharing data between components.

## Live Demo
- Check out the live demo of the project: https://ashoksivakoti.github.io/OrderBook/
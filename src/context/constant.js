export const searchSuggestions = ["AAVE/ETH","ADA/AUD","ADA/ETH","ADA/EUR","ADA/GBP","ADA/USDT","ALGO/ETH","ALGO/USDT","APE/EUR","APE/USDT","APT/EUR","ARB/EUR","ARB/USD","ATOM/ETH","ATOM/EUR","ATOM/USDT","AVAX/EUR","AVAX/USDT","BAT/ETH","BCH/EUR","BCH/USDT","BTT/EUR","CHZ/EUR","CRV/ETH","DAI/USDT","DOT/ETH","DOT/EUR","DOT/GBP","DOT/USDT","EGLD/EUR","ENJ/EUR","ENJ/GBP","EOS/ETH","EOS/EUR","EOS/USDT","ETH/AUD","ETH/DAI","ETH/USDC","ETH/USDT","FIL/ETH","FTM/EUR","GALA/EUR","GAL/EUR","GMT/EUR","GRT/EUR","ICP/EUR","ICX/ETH","JASMY/EUR","KAVA/ETH","KNC/ETH","KSM/ETH","LINK/AUD","LINK/ETH","LINK/EUR","LINK/GBP","LINK/USDT","LSK/ETH","LTC/ETH","LTC/GBP","LTC/USDT","LUNA/EUR","MANA/ETH","MANA/USDT","MATIC/EUR","MATIC/GBP","MATIC/USDT","NANO/ETH","NEAR/EUR","OMG/ETH","QTUM/ETH","RUNE/EUR","SC/ETH","SHIB/EUR","SHIB/USDT","SNX/ETH","SOL/EUR","SOL/GBP","SOL/USDT","SUI/EUR","TRX/ETH","TRX/EUR","UNI/ETH","UNI/EUR","USDC/USDT","UST/USDT","WAVES/ETH","WAVES/EUR","ETC/ETH","ETC/EUR","ETH/EUR","ETH/GBP","LTC/EUR","XMR/USDT","XRP/AUD","XRP/ETH","XRP/GBP","XRP/USDT","XTZ/ETH","XTZ/USDT","XLM/EUR","XRP/EUR", 
"YFI/EUR"]

//   const [bSymbols, setBsymbols] = useState([]);
//   const [kSymbols, setKsymbols] = useState([]);

// useEffect(() => {
//     getSymbols();
//     fetchSymbols();
//   }, []);

//   useEffect(() => {
//     const newIntersection = kSymbols.filter(symbol => bSymbols.includes(symbol));
//     setIntersection(newIntersection);
//   }, [bSymbols, kSymbols]);

//   const getSymbols = async () => {
//     try {
//       const res = await axios.get(`https://api.binance.com/api/v1/exchangeInfo`);
//       const symbolsarray = res.data.symbols.map(item => item.symbol);
//       setBsymbols(symbolsarray);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchSymbols = async () => {
//     try {
//       const response = await axios.get('https://api.kraken.com/0/public/AssetPairs');
//       const pairs = Object.keys(response.data.result)
//         .filter(symbol => response.data.result[symbol].wsname)
//         .map(symbol => response.data.result[symbol].wsname.replace('/', ''));
//       setKsymbols(pairs);
//     } catch (error) {
//       console.error(error);
//     }
//   };
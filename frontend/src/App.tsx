import { useEffect, useState } from 'react';
import { Coins, Menu, Shield, TrendingUp } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

interface CryptoToken {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  price: number;
}

interface Trade {
  id: number;
  type: 'buy' | 'sell';
  token: string;
  amount: number;
  price: number;
  timestamp: Date;
  profit?: number;
}

function App() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      console.log("User is not authenticated");
      login();
    }
  }, [ready, authenticated]);


  const [tokens] = useState<CryptoToken[]>([
    { id: 1, name: 'Ethereum', symbol: 'ETH', amount: 100, price: 3500 },
    { id: 2, name: 'Solana', symbol: 'SOL', amount: 1000, price: 125 },
    { id: 3, name: 'Bitcoin', symbol: 'BTC', amount: 10, price: 65000 },
    { id: 4, name: 'Cardano', symbol: 'ADA', amount: 5000, price: 0.65 },
  ]);

  const [trades] = useState<Trade[]>([
    { id: 1, type: 'buy', token: 'ETH', amount: 10, price: 3200, timestamp: new Date('2024-02-01'), profit: 3000 },
    { id: 2, type: 'sell', token: 'BTC', amount: 2, price: 68000, timestamp: new Date('2024-02-15'), profit: 6000 },
    { id: 3, type: 'buy', token: 'SOL', amount: 500, price: 100, timestamp: new Date('2024-02-20'), profit: 12500 },
  ]);

  const [selectedToken, setSelectedToken] = useState<CryptoToken | null>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  const handleBuy = () => {
    if (!buyAmount || !buyPrice) return;
    console.log('Buy:', { token: selectedToken?.symbol, amount: buyAmount, price: buyPrice });
  };

  const handleSell = () => {
    if (!sellAmount || !sellPrice) return;
    console.log('Sell:', { token: selectedToken?.symbol, amount: sellAmount, price: sellPrice });
  };

  const generateProof = async () => {
    setIsGeneratingProof(true);
    try {
      // Simulate proof generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generating zero-knowledge proof for trades...');
    } finally {
      setIsGeneratingProof(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-6 w-6" />
            <span className="text-xl font-bold">CryptoTrader</span>
          </div>
          {authenticated && <button className="p-2 hover:bg-indigo-700 rounded-lg" onClick={logout}>
            <p>{user?.wallet?.address || "Wallet"}</p>
          </button>}
          {!authenticated && <button className="p-2 hover:bg-indigo-700 rounded-lg" onClick={login}>
            <Menu className="h-6 w-6" />
          </button>}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Token Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokens.map((token) => (
                <tr
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedToken?.id === token.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{token.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{token.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{token.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${token.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trading Panel */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Buy Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-green-600">Buy {selectedToken?.symbol || 'Token'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount to buy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter price"
                />
              </div>
              <button
                onClick={handleBuy}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Buy
              </button>
            </div>
          </div>

          {/* Sell Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Sell {selectedToken?.symbol || 'Token'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount to sell"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter price"
                />
              </div>
              <button
                onClick={handleSell}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        {/* Profitable Trades Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Profitable Trades</h2>
              </div>
              <button
                onClick={generateProof}
                disabled={isGeneratingProof}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="h-4 w-4" />
                <span>{isGeneratingProof ? 'Generating Proof...' : 'Generate Proof'}</span>
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.token}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${trade.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">+${trade.profit?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.timestamp.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
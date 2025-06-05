import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!address || address.length < 30) {
      setError('Please enter a valid token address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress: address })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to track token: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Solana Meme Coin Tracker</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana token address (e.g. 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tracking...
              </span>
            ) : 'Track Token'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Token Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Token Address" value={data.token_address} />
            <StatCard title="Market Cap" value={`$${(data.market_cap || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <StatCard title="Price" value={`$${(data.price || 0).toFixed(8)}`} />
            <StatCard title="Holders" value={(data.holders || 0).toLocaleString()} />
            <StatCard title="5m Volume" value={`$${(data.volume_5m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
            <StatCard title="15m Volume" value={`$${(data.volume_15m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WalletTable title="Multi-TX Wallets" data={data.multi_tx_wallets} />
            <WalletTable title="Bundled Wallets" data={data.bundled_wallets} />
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Tracked at: {new Date(data.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-lg font-bold text-gray-800 mt-1 truncate">{value}</p>
    </div>
  );
}

function WalletTable({ title, data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-gray-700 font-medium mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-gray-700 font-medium mb-3">{title}</h3>
      <div className="max-h-60 overflow-y-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-gray-500 font-medium pb-2">Wallet</th>
              <th className="text-right text-xs text-gray-500 font-medium pb-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index < data.length - 1 ? 'border-b border-gray-200' : ''}>
                <td className="py-2 text-sm font-mono truncate max-w-[120px]">{item.wallet}</td>
                <td className="py-2 text-right text-sm">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
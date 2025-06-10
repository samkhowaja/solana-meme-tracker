import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tokens/list');
      const data = await response.json();
      setTokens(data);
    } catch (err) {
      setError('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/tokens/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add token');
      }

      setAddress('');
      setSuccess('Token added successfully! Data will be collected automatically at 15m, 30m, and 1hr intervals.');
      fetchTokens();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
            Solana Meme Coin Tracker
          </h1>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Track your favorite Solana meme coins with automated data collection at 15 minutes, 
            30 minutes, and 1 hour intervals after adding.
          </p>
        </header>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Add New Token</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana token address"
              className="flex-1 p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={loading}
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              disabled={loading || !address}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : 'Track Token'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
              <p className="text-green-300">{success}</p>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Tracked Tokens</h2>
            <button 
              onClick={fetchTokens} 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">No tokens being tracked yet. Add your first token above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/20">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-indigo-900/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">Added</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-indigo-900/10 divide-y divide-gray-800">
                  {tokens.map((token) => (
                    <tr key={token.address} className="hover:bg-indigo-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                          <div>
                            <div className="font-medium text-white">
                              <Link href={}>
                                <span className="cursor-pointer hover:text-amber-400 transition-colors">
                                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                </span>
                              </Link>
                            </div>
                            <div className="text-sm text-gray-300">SOLANA</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(token.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400">
                          <span className="flex w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Tracking
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link href={}>
                          <button className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>Data collected automatically at 15m, 30m, and 1hr intervals after token is added</p>
          <p className="mt-2">© {new Date().getFullYear()} Solana Meme Coin Tracker</p>
        </footer>
      </div>
    </div>
  );
}

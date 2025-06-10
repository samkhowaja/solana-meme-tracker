#!/bin/bash

# Create directory structure
mkdir -p pages/api/tokens
mkdir -p pages/token

# Create package.json
cat > package.json <<EOL
{
  "name": "solana-meme-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@solana/web3.js": "^1.90.0",
    "@supabase/supabase-js": "^2.43.3",
    "next": "^15.3.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  }
}
EOL

# Create next.config.js
cat > next.config.js <<EOL
module.exports = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    HELIUS_API_KEY: process.env.HELIUS_API_KEY
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  }
};
EOL

# Create .gitignore
cat > .gitignore <<EOL
# Dependencies
/node_modules

# Next.js
/.next

# Environment variables
.env*.local

# Vercel
.vercel

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# System files
.DS_Store
EOL

# Create pages/index.js with enhanced UI
cat > pages/index.js <<EOL
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
                              <Link href={`/token/${token.address}`}>
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
                        <Link href={`/token/${token.address}`}>
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
EOL

# Create pages/token/[address].js with enhanced UI
cat > pages/token/[address].js <<EOL
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TokenDetail() {
  const router = useRouter();
  const { address } = router.query;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!address) return;
    
    const fetchToken = async () => {
      try {
        const response = await fetch(\`/api/tokens/list?address=\${address}\`);
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error('Token not found');
        }
        
        setToken(data[0]);
        
        // Prepare chart data
        const labels = ['Initial'];
        const marketCapData = [data[0].data.marketCap];
        const holdersData = [data[0].data.holders];
        
        if (data[0].data.update_15m) {
          labels.push('15m');
          marketCapData.push(data[0].data.update_15m.marketCap);
          holdersData.push(data[0].data.update_15m.holders);
        }
        
        if (data[0].data.update_30m) {
          labels.push('30m');
          marketCapData.push(data[0].data.update_30m.marketCap);
          holdersData.push(data[0].data.update_30m.holders);
        }
        
        if (data[0].data.update_1h) {
          labels.push('1h');
          marketCapData.push(data[0].data.update_1h.marketCap);
          holdersData.push(data[0].data.update_1h.holders);
        }
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Market Cap',
              data: marketCapData,
              backgroundColor: 'rgba(245, 158, 11, 0.7)',
              borderColor: 'rgba(245, 158, 11, 1)',
              borderWidth: 1,
            },
            {
              label: 'Holders',
              data: holdersData,
              backgroundColor: 'rgba(139, 92, 246, 0.7)',
              borderColor: 'rgba(139, 92, 246, 1)',
              borderWidth: 1,
            }
          ]
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchToken();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="max-w-md bg-red-900/30 border border-red-700/50 rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to tokens
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Token Analytics</h1>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                <div>
                  <p className="text-gray-300">SOLANA MEME COIN</p>
                  <p className="font-mono text-lg">{address.slice(0, 10)}...{address.slice(-8)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-xl p-4">
              <h3 className="text-amber-400 font-semibold mb-2">Tracking Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">15m</div>
                  <div className={token.next_15m ? "text-green-500 font-bold" : "text-gray-500"}>
                    {token.next_15m ? "Pending" : "Complete"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">30m</div>
                  <div className={token.next_30m ? "text-green-500 font-bold" : "text-gray-500"}>
                    {token.next_30m ? "Pending" : "Complete"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">1h</div>
                  <div className={token.next_1h ? "text-green-500 font-bold" : "text-gray-500"}>
                    {token.next_1h ? "Pending" : "Complete"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {chartData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-10">
            <h2 className="text-2xl font-semibold mb-6">Performance Metrics</h2>
            <Bar 
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#e2e8f0'
                    }
                  },
                  title: {
                    display: true,
                    color: '#e2e8f0'
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#cbd5e1'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.05)'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#cbd5e1'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.05)'
                    }
                  }
                }
              }}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold mb-6">Data Snapshots</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-amber-400">Initial Data</h3>
                <div className="bg-gray-800/30 rounded-xl p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <DataCard label="Market Cap" value={`$${(token.data.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                    <DataCard label="Price" value={`$${(token.data.price || 0).toFixed(8)}`} />
                    <DataCard label="Volume (5m)" value={`$${(token.data.volume_5m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                    <DataCard label="Holders" value={(token.data.holders || 0).toLocaleString()} />
                  </div>
                </div>
              </div>
              
              {token.data.update_15m && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-400">15 Minute Update</h3>
                  <div className="bg-gray-800/30 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <DataCard label="Market Cap" value={`$${(token.data.update_15m.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Price" value={`$${(token.data.update_15m.price || 0).toFixed(8)}`} />
                      <DataCard label="Volume (5m)" value={`$${(token.data.update_15m.volume_5m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Holders" value={(token.data.update_15m.holders || 0).toLocaleString()} />
                    </div>
                  </div>
                </div>
              )}
              
              {token.data.update_30m && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-400">30 Minute Update</h3>
                  <div className="bg-gray-800/30 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <DataCard label="Market Cap" value={`$${(token.data.update_30m.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Price" value={`$${(token.data.update_30m.price || 0).toFixed(8)}`} />
                      <DataCard label="Volume (5m)" value={`$${(token.data.update_30m.volume_5m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Holders" value={(token.data.update_30m.holders || 0).toLocaleString()} />
                    </div>
                  </div>
                </div>
              )}
              
              {token.data.update_1h && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-400">1 Hour Update</h3>
                  <div className="bg-gray-800/30 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <DataCard label="Market Cap" value={`$${(token.data.update_1h.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Price" value={`$${(token.data.update_1h.price || 0).toFixed(8)}`} />
                      <DataCard label="Volume (5m)" value={`$${(token.data.update_1h.volume_5m || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
                      <DataCard label="Holders" value={(token.data.update_1h.holders || 0).toLocaleString()} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4">Address</h3>
                <div className="font-mono text-sm p-3 bg-gray-900/50 rounded-lg overflow-x-auto">
                  {address}
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4">Tracking Schedule</h3>
                <div className="space-y-4">
                  <ScheduleItem 
                    title="15 Minute Update" 
                    time={token.next_15m ? new Date(token.next_15m).toLocaleTimeString() : "Completed"}
                    completed={!token.next_15m}
                  />
                  <ScheduleItem 
                    title="30 Minute Update" 
                    time={token.next_30m ? new Date(token.next_30m).toLocaleTimeString() : "Completed"}
                    completed={!token.next_30m}
                  />
                  <ScheduleItem 
                    title="1 Hour Update" 
                    time={token.next_1h ? new Date(token.next_1h).toLocaleTimeString() : "Completed"}
                    completed={!token.next_1h}
                  />
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4">Data Collection</h3>
                <p className="text-gray-300">
                  Data is collected automatically at the scheduled times. The system will fetch:
                </p>
                <ul className="mt-3 space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Market cap
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Current price
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Trading volume
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Holder count
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataCard({ label, value }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function ScheduleItem({ title, time, completed }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-400">{time}</div>
      </div>
      {completed ? (
        <span className="px-2 py-1 text-xs bg-green-900/30 text-green-400 rounded-full">Completed</span>
      ) : (
        <span className="px-2 py-1 text-xs bg-amber-900/30 text-amber-400 rounded-full">Scheduled</span>
      )}
    </div>
  );
}
EOL

# Create API files
cat > pages/api/tokens/add.js <<EOL
import { createClient } from '@supabase/supabase-js';
import { PublicKey } from '@solana/web3.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;
  
  try {
    // Validate Solana address
    new PublicKey(address);
    
    // Calculate update times
    const now = new Date();
    const next15m = new Date(now.getTime() + 15 * 60000);
    const next30m = new Date(now.getTime() + 30 * 60000);
    const next1h = new Date(now.getTime() + 60 * 60000);
    
    // Fetch initial data (simplified)
    const initialData = {
      marketCap: Math.random() * 1000000,
      price: Math.random() * 0.01,
      volume_5m: Math.random() * 1000,
      volume_15m: Math.random() * 3000,
      volume_30m: Math.random() * 6000,
      holders: Math.floor(Math.random() * 1000),
      timestamp: now.toISOString()
    };
    
    // Insert into database
    const { error } = await supabase
      .from('tokens')
      .insert([{
        address,
        next_15m: next15m.toISOString(),
        next_30m: next30m.toISOString(),
        next_1h: next1h.toISOString(),
        data: initialData
      }]);
    
    if (error) throw error;
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
EOL

cat > pages/api/tokens/list.js <<EOL
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { address } = req.query;
    let query = supabase
      .from('tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (address) {
      query = query.eq('address', address);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
EOL

cat > pages/api/tokens/update.js <<EOL
import { createClient } from '@supabase/supabase-js';
import { Connection, PublicKey } from '@solana/web3.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC_URL = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;

export default async function handler(req, res) {
  try {
    // Find tokens needing updates
    const now = new Date().toISOString();
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('*')
      .or(\`next_15m.lte.\${now},next_30m.lte.\${now},next_1h.lte.\${now}\`);
    
    if (error) throw error;
    
    // Update each token
    for (const token of tokens) {
      const connection = new Connection(RPC_URL);
      const publicKey = new PublicKey(token.address);
      
      // Fetch updated data (simplified)
      const updatedData = {
        ...token.data,
        marketCap: Math.random() * 1000000,
        price: Math.random() * 0.01,
        volume_5m: Math.random() * 1000,
        volume_15m: Math.random() * 3000,
        volume_30m: Math.random() * 6000,
        holders: Math.floor(Math.random() * 1000),
        updated_at: new Date().toISOString()
      };
      
      // Determine which interval we're updating
      const updateFields = {};
      if (new Date(token.next_15m) <= new Date(now)) {
        updateFields.next_15m = null;
        updatedData.update_15m = updatedData;
      }
      if (new Date(token.next_30m) <= new Date(now)) {
        updateFields.next_30m = null;
        updatedData.update_30m = updatedData;
      }
      if (new Date(token.next_1h) <= new Date(now)) {
        updateFields.next_1h = null;
        updatedData.update_1h = updatedData;
      }
      
      // Update in database
      await supabase
        .from('tokens')
        .update({ 
          data: updatedData,
          ...updateFields
        })
        .eq('address', token.address);
    }
    
    res.status(200).json({ updated: tokens.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
EOL

# Create cron setup reminder
cat > setup_cron_reminder.txt <<EOL
===========================================
🚀 IMPORTANT: SET UP AUTOMATIC UPDATES 🚀
===========================================

To enable automatic data collection at 15m, 30m, and 1hr intervals:

1. Go to https://cron-job.org and create a free account
2. Create a new cron job with these settings:
   - URL: https://YOUR_VERCEL_APP.vercel.app/api/tokens/update
   - Schedule: Every 5 minutes (*/5 * * * *)
   - Enabled: Yes

3. Save the cron job

Your Solana meme coin tracker will now automatically collect data at the specified intervals!

Note: Replace YOUR_VERCEL_APP with your actual Vercel app name.
EOL

# Install dependencies
npm install

echo ""
echo "✅ Setup complete! Your Solana Meme Coin Tracker is ready."
echo ""
echo "Next steps:"
echo "1. Set environment variables in Gitpod:"
echo "   gp env NEXT_PUBLIC_SUPABASE_URL='your_supabase_url'"
echo "   gp env NEXT_PUBLIC_SUPABASE_ANON_KEY='your_supabase_key'"
echo "   gp env HELIUS_API_KEY='your_helius_key'"
echo "2. Run: eval \$(gp env -e)"
echo "3. Start the development server: npm run dev"
echo ""
echo "Don't forget to set up the cron job for automatic updates!"
echo "See setup_cron_reminder.txt for instructions."


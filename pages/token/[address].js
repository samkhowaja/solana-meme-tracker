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
        const response = await fetch(`/api/tokens/list?address=${address}`);
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
                    <DataCard label="Market Cap" value={} />
                    <DataCard label="Price" value={} />
                    <DataCard label="Volume (5m)" value={} />
                    <DataCard label="Holders" value={(token.data.holders || 0).toLocaleString()} />
                  </div>
                </div>
              </div>
              
              {token.data.update_15m && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-amber-400">15 Minute Update</h3>
                  <div className="bg-gray-800/30 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <DataCard label="Market Cap" value={} />
                      <DataCard label="Price" value={} />
                      <DataCard label="Volume (5m)" value={} />
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
                      <DataCard label="Market Cap" value={} />
                      <DataCard label="Price" value={} />
                      <DataCard label="Volume (5m)" value={} />
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
                      <DataCard label="Market Cap" value={} />
                      <DataCard label="Price" value={} />
                      <DataCard label="Volume (5m)" value={} />
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

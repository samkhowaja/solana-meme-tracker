import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function TokenDetail() {
  const router = useRouter();
  const { address } = router.query;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="max-w-4xl mx-auto p-6">
        <p>Loading token data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Token Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Address: {address}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Initial Data</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(token.data, null, 2)}
            </pre>
          </div>
          
          {token.data.update_15m && (
            <div>
              <h3 className="text-lg font-medium mb-2">15m Update</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(token.data.update_15m, null, 2)}
              </pre>
            </div>
          )}
          
          {token.data.update_30m && (
            <div>
              <h3 className="text-lg font-medium mb-2">30m Update</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(token.data.update_30m, null, 2)}
              </pre>
            </div>
          )}
          
          {token.data.update_1h && (
            <div>
              <h3 className="text-lg font-medium mb-2">1hr Update</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(token.data.update_1h, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Next Updates</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">15m:</span> 
              {token.next_15m ? new Date(token.next_15m).toLocaleString() : 'Completed'}
            </li>
            <li>
              <span className="font-medium">30m:</span> 
              {token.next_30m ? new Date(token.next_30m).toLocaleString() : 'Completed'}
            </li>
            <li>
              <span className="font-medium">1hr:</span> 
              {token.next_1h ? new Date(token.next_1h).toLocaleString() : 'Completed'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
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

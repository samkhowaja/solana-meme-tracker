import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') return res.status(405).end();
  
  console.log('Received token address:', req.body.tokenAddress);
  
  try {
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not set');
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Supabase client created');
    
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('token_snapshots')
      .select('*')
      .limit(1);
    
    if (testError) throw new Error(`Supabase test failed: ${testError.message}`);
    
    console.log('Supabase connection verified');
    
    // Create mock data
    const tokenData = {
      token_address: req.body.tokenAddress,
      market_cap: Math.random() * 1000000,
      price: Math.random() * 0.01,
      volume_5m: Math.random() * 1000,
      volume_15m: Math.random() * 3000,
      volume_30m: Math.random() * 6000,
      holders: Math.floor(Math.random() * 1000),
      multi_tx_wallets: [{ wallet: "A1v2...z9x8", count: 3 }],
      bundled_wallets: [{ wallet: "B2c3...y8w7", count: 5 }],
      created_at: new Date().toISOString()
    };
    
    console.log('Inserting data:', tokenData);
    
    // Insert into database
    const { data, error } = await supabase
      .from('token_snapshots')
      .insert([tokenData]);
    
    if (error) throw new Error(`Supabase insert error: ${error.message}`);
    
    console.log('Insert successful:', data);
    return res.status(200).json(data[0]);
    
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
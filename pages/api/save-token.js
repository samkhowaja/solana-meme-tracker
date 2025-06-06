import { createClient } from '@supabase/supabase-js';
import { Connection, PublicKey } from '@solana/web3.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  console.log('Environment variables:', {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    HELIUS_API_KEY: process.env.HELIUS_API_KEY ? "Set" : "Missing"
  });

  const { tokenAddress } = req.body;
  
  try {
    // Basic validation
    if (!tokenAddress || tokenAddress.length < 30) {
      return res.status(400).json({ error: "Invalid token address" });
    }
    
    // Verify Supabase connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test Supabase connection
    const { error: supabaseError } = await supabase
      .from('token_snapshots')
      .select('*')
      .limit(1);
    
    if (supabaseError) throw new Error(`Supabase error: ${supabaseError.message}`);
    
    // Test Solana connection
    try {
      const publicKey = new PublicKey(tokenAddress);
      console.log('Public key created successfully');
    } catch (e) {
      throw new Error(`Invalid Solana address: ${e.message}`);
    }
    
    // ... rest of your code
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return mock data for now
    res.status(200).json({
      token_address: req.body.tokenAddress,
      market_cap: Math.random() * 1000000,
      price: Math.random() * 0.01,
      volume_5m: Math.random() * 1000,
      volume_15m: Math.random() * 3000,
      volume_30m: Math.random() * 6000,
      holders: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

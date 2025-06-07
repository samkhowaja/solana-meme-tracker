export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      heliusKey: process.env.HELIUS_API_KEY ? 'Set' : 'Missing'
    }
  });
}

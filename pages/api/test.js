export default function handler(req, res) {
  res.status(200).json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    heliusKey: process.env.HELIUS_API_KEY ? "Exists" : "Missing"
  })
}
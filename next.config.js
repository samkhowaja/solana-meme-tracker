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

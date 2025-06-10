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

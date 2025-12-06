// pages/api/proxy.js - Ultra-simple CORS-enabled proxy
export default async function handler(req, res) {
  // CORS headers FIRST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight check
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get params
  const { from, to } = req.query;
  if (!from || !to) {
    res.status(400).json({ error: 'Missing from/to params' });
    return;
  }

  // Use YOUR new direct API (with affiliate ID)
  const affiliateId = '68723b79-85d8-4438-8e84-ffdcdbba258b';
  const targetUrl = `https://api.csbattle.com/leaderboards/affiliates/${affiliateId}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  try {
    console.log('Proxy fetching:', targetUrl); // Vercel logs
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'yosoykush-leaderboard/1.0',
        // Add auth if needed (e.g., 'Authorization': 'Bearer YOUR_TOKEN')
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy failed', 
      details: error.message,
      fallbackUrl: targetUrl // For debugging
    });
  }
}

// Vercel config
export const config = { api: { bodyParser: false } };

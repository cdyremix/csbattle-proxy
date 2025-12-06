// pages/api/proxy.js - FIXED: Manual query parsing + full CORS
import { parse } from 'querystring'; // Built-in Node.js module

export default async function handler(req, res) {
  // CORS headers (always first)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Only GET allowed' });
    return;
  }

  // MANUAL QUERY PARSING (fixes Vercel bug)
  const queryString = req.url.split('?')[1];
  const queryParams = parse(queryString || '');
  const from = queryParams.from;
  const to = queryParams.to;

  console.log('Proxy received params:', { from, to }); // Log for debugging

  if (!from || !to) {
    res.status(400).json({ error: 'Missing from/to params', received: { from, to } });
    return;
  }

  // Your affiliate API
  const affiliateId = '68723b79-85d8-4438-8e84-ffdcdbba258b';
  const targetUrl = `https://api.csbattle.com/leaderboards/affiliates/${affiliateId}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  try {
    console.log('Proxy fetching:', targetUrl);
    const apiRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'yosoykush-leaderboard/1.0',
        // Add if needed: 'Authorization': 'Bearer YOUR_TOKEN'
      },
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      throw new Error(`API ${apiRes.status}: ${errorText}`);
    }

    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy failed', 
      details: error.message,
      debug: { from, to, targetUrl }
    });
  }
}

// Vercel config - DISABLE bodyParser for manual parsing
export const config = { 
  api: { 
    bodyParser: false,
    externalResolver: true // Allows fetch to external APIs
  } 
};

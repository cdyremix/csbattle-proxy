// api/proxy.js
export default async function handler(req, res) {
  // CORS preflight (browser safety check)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');  // Or 'https://yosoykush.fun'
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Need ?from=YYYY-MM-DD HH:mm:ss&to=YYYY-MM-DD HH:mm:ss' });
  }

  const targetUrl = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${from}&to=${to}`;

  try {
    const apiRes = await fetch(targetUrl);
    if (!apiRes.ok) throw new Error(`CSBattle API: ${apiRes.status}`);
    const data = await apiRes.json();

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: `Failed to fetch: ${error.message}` });
  }
}

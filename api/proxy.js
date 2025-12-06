const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or 'https://yosoykush.fun' for security
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from or to parameters' });
  }

  // Replace with the real endpoint from inspecting csbattle.gg affiliate dashboard
  // Example: 'https://api.csbattle.gg/v1/affiliates/referrals?key=YOUR_API_KEY&from=${from}&to=${to}'
  // Add headers if needed, e.g., { 'Authorization': 'Bearer YOUR_TOKEN' }
  const targetUrl = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${from}&to=${to}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      // Add if needed: headers: { 'Authorization': 'YOUR_KEY_HERE' }
    });
    if (!response.ok) {
      throw new Error(`Target API error: HTTP ${response.status}`);
    }
    const data = await response.json();
    res.json(data); // Expect {referrals: [{displayName, imageUrl, xpEarned, ...}]}
  } catch (error) {
    console.error(error); // Logs to Vercel for debugging
    res.status(502).json({ error: `Proxy fetch failed: ${error.message}. Check targetUrl and auth.` });
  }
};

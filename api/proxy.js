// api/proxy.js
export default async function handler(req, res) {
  // ----- CORS pre-flight -----
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');          // change to your domain later
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from / to' });
  }

  const target = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${from}&to=${to}`;

  try {
    const apiRes = await fetch(target);
    if (!apiRes.ok) throw new Error(`API ${apiRes.status}`);
    const data = await apiRes.json();

    // ----- Add CORS headers to the real response -----
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: 'Failed to reach CSBattle' });
  }
}

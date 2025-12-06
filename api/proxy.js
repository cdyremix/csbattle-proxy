// For Pages Router: pages/api/proxy.js
// For App Router: app/api/proxy/route.js  (use GET handler below)

export default function handler(req, res) {
  // Allow any origin (or restrict to your domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from/to parameters' });
  }

  const targetUrl = `https://csbattle.gg/api/leaderboard/monthly?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  fetch(targetUrl)
    .then(r => {
      if (!r.ok) throw new Error(`Upstream error: ${r.status}`);
      return r.json();
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.error('Proxy error:', err.message);
      res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
    });
}

// Important for Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

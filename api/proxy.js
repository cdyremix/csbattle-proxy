export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from/to params' });
  }

  // Format dates: Replace 'T' with space and remove timezone if present
  from = from.replace('T', ' ').split('.')[0]; // e.g., '2025-12-01 00:00:00'
  to = to.replace('T', ' ').split('.')[0];

  const apiUrl = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

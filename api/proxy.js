export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from/to params' });
  }

  // Format dates: Replace 'T' with space and remove milliseconds/timezone
  from = from.replace('T', ' ').split('.')[0];
  to = to.replace('T', ' ').split('.')[0];

  const apiUrl = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.message && data.message.includes('disabled')) {
      return res.status(200).json({ referrals: [] }); // Return empty list to avoid 500
    }
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

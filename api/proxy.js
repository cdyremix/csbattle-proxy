export default async function handler(req, res) {
  const { from, to } = req.query;
  const apiUrl = `https://api.csbattle.com/leaderboards/affiliates/68723b79-85d8-4438-8e84-ffdcdbba258b?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed' });
  }
}

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from or to parameters' });
  }

  const targetUrl = `https://affiliates.csbattle.gg/v1/referrals?from=${from}&to=${to}`; // Replace with actual target API URL

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      // If API key needed: headers: { 'Authorization': 'Bearer YOUR_KEY' } or add &key=YOUR_KEY to targetUrl
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

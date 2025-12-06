// For csbattle-proxy /api/proxy.js
// Assuming the real CSBattle API URL is 'https://api.csbattle.gg/some/endpoint' - replace with actual if known.
// If not, check Vercel logs for the current code and add the CORS part.
module.exports = async (req, res) => {
  try {
    const { from, to } = req.query;
    const apiUrl = `https://api.csbattle.gg/referrals?from=${from}&to=${to}`; // REPLACE with actual real API URL
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth if needed, e.g., 'Authorization': 'Bearer YOUR_KEY'
      },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: `API error: ${response.statusText}` });
      return;
    }
    const data = await response.json();
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: `Proxy error: ${error.message}` });
  }
};

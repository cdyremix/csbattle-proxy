module.exports = async (req, res) => {
  // Add CORS headers early for all responses, including errors
  res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { from, to } = req.query;
    const apiUrl = `https://api.csbattle.com/referrals?from=${from}&to=${to}`; // REPLACE with actual real CSBattle API URL
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth if needed, e.g., 'Authorization': 'Bearer YOUR_KEY_HERE'
      },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: `API error: ${response.statusText}` });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error details:', error); // Log for Vercel dashboard
    res.status(500).json({ error: `Proxy error: ${error.message}` });
  }
};

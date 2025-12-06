module.exports = async (req, res) => {
  try {
    const { from, to } = req.query;
    const apiUrl = `https://api.csbattle.gg/referrals?from=${from}&to=${to}`; // REPLACE with the actual CSBattle API URL and add any key/header if needed
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
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).json(data);
  } catch (error) {
    // Add CORS even on error
    res.setHeader('Access-Control-Allow-Origin', 'https://yosoykush.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(500).json({ error: `Proxy error: ${error.message}` });
  }
};

const express = require('express');
const app = express();
const PORT = 5001;

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is working!' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`Server address:`, server.address());
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

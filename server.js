const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from the repository root
app.use(express.static(__dirname));

// Fallback to the main HTML file
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'loreloom.html'));
});

app.listen(port, () => {
  console.log(`LoreLoom server running at http://localhost:${port}`);
});

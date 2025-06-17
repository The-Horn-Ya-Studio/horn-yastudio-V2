const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data.json');

// Read data
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_PATH)) return res.json({ members: [], photos: [] });
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  res.json(JSON.parse(data));
});

// Save data
app.post('/api/data', (req, res) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Storage API running on http://localhost:${PORT}`);
});

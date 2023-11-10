const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(cors());

app.get('/followercount', async (req, res) => {
  const filePath = path.join(__dirname, 'followerlist', 'followerlist.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    res.json({ followtech: data.followtech });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

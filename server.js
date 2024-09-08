const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Set up SQLite Database
let db = new sqlite3.Database(':memory:');

// Create a table to store search history
db.run(`CREATE TABLE search_history (id INTEGER PRIMARY KEY, author TEXT)`);

// Endpoint to get a random quote
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Endpoint to search quotes by author
app.get('/api/quotes/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`https://api.quotable.io/quotes?author=${author}`);
    res.json(response.data);

    // Store search in database
    db.run(`INSERT INTO search_history(author) VALUES(?)`, [author], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`Stored search by ${author}`);
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Endpoint to get search history
app.get('/api/history', (req, res) => {
  db.all(`SELECT * FROM search_history`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve history' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
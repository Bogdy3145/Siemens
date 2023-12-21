
console.log('server loaded');
const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  filename: './quiz.db', 
  driver: sqlite3.Database,
};

let db; 
let selectedQuestionIds = []; 

// Connect to SQLite database
open(dbConfig)
  .then((database) => {
    db = database; 
    console.log('Connected to SQLite database');
    // Close the database connection when the server is stopped
    process.on('SIGINT', () => {
      db.close();
      process.exit();
    });
  })
  .catch((err) => {
    console.error('Error connecting to SQLite database:', err);
  });

// Function to pick a random question ID from the database
async function pickRandomQuestionId() {
  // This fetches all ID's that haven't already been selected
  const result = await db.all('SELECT id FROM QuizQuestions WHERE id NOT IN (' + selectedQuestionIds.map(() => '?').join(', ') + ')', selectedQuestionIds);

  // Pick a random question ID from the available options
  const randomIndex = Math.floor(Math.random() * result.length);
  const randomQuestionId = result[randomIndex].id;

  // Add the selected question ID to the array
  selectedQuestionIds.push(randomQuestionId);

  return randomQuestionId;
}

// API endpoint to get a random question
app.get('/api/question', async (req, res) => {
  try {
    const randomQuestionId = await pickRandomQuestionId();

    const result = await db.get('SELECT * FROM QuizQuestions WHERE id = ?', [randomQuestionId]);

    res.json(result);
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reset', (req, res) => {
  try {
    selectedQuestionIds = []; // Reset the array
    res.json({ message: 'Selected question IDs reset successfully.' });
  } catch (err) {
    console.error('Error resetting selected question IDs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'my-secret-pw',
  database: process.env.DB_NAME || 'mydatabase'
});


// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_NAME);

    return;
  }
  console.log('Connected to the database');
  

});

// Route for the homepage
app.get('/', (req, res) => {
  res.send('Hello, Docker!');
});

// Route to return a dummy JSON object
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading data from the database:', err);
      res.status(500).json({ message: 'Error retrieving data' });
      return;
    }
    res.json(results);
  });
});

// Route to handle POST requests
app.post('/data', (req, res) => {
  console.log('Request body:', req.body); // Log the request body for debugging

  // Check if req.body is defined
  if (req.body) {
    const { Name, Age, Hobbies } = req.body;

    // Check if all required fields are present
    if (Name && Age && Array.isArray(Hobbies)) {
      // Process the received data (e.g., save to a database, etc.)
      console.log('Received data:', { Name, Age, Hobbies });

      // Store data in the database
      const query = 'INSERT INTO users (name, age, hobbies) VALUES (?, ?, ?)';
      connection.query(query, [Name, Age, Hobbies.join(', ')], (err, results) => {
        if (err) {
          console.error('Error inserting data into the database:', err);
          res.status(500).json({ message: 'Error saving data' });
          return;
        }



      // Respond with a success message
      res.json({ message: 'Data received successfully' });
    });
    } else {
      // Respond with an error message if the data is invalid
      res.status(400).json({ message: 'Invalid data' });
    }
  } else {
    // Respond with an error if req.body is undefined
    res.status(400).json({ message: 'No data received' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

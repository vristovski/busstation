const { Pool } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Create a new pool instance with the connection details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'sa',
    port: 5432,
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
    const { email, password, firstName, lastName, role, dateOfBirth } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT RegisterUser($1, $2, $3, $4, $5, $6) AS result',
        [email, password, firstName, lastName, role, dateOfBirth],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while registering the user.' });
            } else {
                const result = queryRes.rows[0].result;
                res.json({ message: result });
            }
        }
    );
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);

    // Call the LoginUser function in the database
    pool.query(
        'SELECT LoginUser($1, $2) AS result',
        [email, password],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while logging in.' });
            } else {
                const result = queryRes.rows[0].result;
                res.json({ loggedIn: result });
                console.error('Successful');
            }
        }
    );
});

app.get('/schedule', (req, res) => {
    // Query the database to fetch the schedule data
    pool.query(
        `SELECT * FROM Schedule`,
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while fetching the schedule.' });
            } else {
                const schedule = queryRes.rows;
                res.json(schedule);
            }
        }
    );
});

app.post('/searchRoute', (req, res) => {
    const { startLocation, endLocation } = req.body;
    console.log("req.body", req.body);
    // Call the searchRoute function in the database
    pool.query(
        'SELECT * FROM searchRoute($1, $2)',
        [startLocation, endLocation],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while searching for routes.' });
            } else {
                const searchResults = queryRes.rows;
                console.error('Successful: ', queryRes.rows);
                res.json(searchResults);
            }
        }
    );
});


app.listen(5000, () => {
    console.log('Server listening on port 3001');
});

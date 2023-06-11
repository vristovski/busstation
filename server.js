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

// app.post('/register', (req, res) => {
//     const { email, password, firstName, lastName, role, dateOfBirth } = req.body;
//
//     // Check if user already exists
//     pool.query(
//         'SELECT * FROM "Busify"."User" WHERE "Email" = $1',
//         [email],
//         (err, queryRes) => {
//             console.log("Started...")
//             if (err) {
//                 console.log("First if...")
//                 console.error('Error executing query:', err);
//                 res.status(500).json({ error: 'An error occurred while registering the user.' });
//             } else {
//                 console.log("First else...")
//                 if (queryRes.rows.length > 0) {
//                     console.log("Second if...")
//                     // User already exists
//                     res.status(400).json({ error: 'User already exists.' });
//                 } else {
//                     console.log("Second else...")
//                     // User doesn't exist, insert the new user
//                     pool.query(
//                         'INSERT INTO "Busify"."User" ("Email", "Password", "First_Name", "Last_Name", "Role", "Date_Of_Birth") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//                         [email, password, firstName, lastName, role, dateOfBirth],
//                         (err, insertRes) => {
//                             if (err) {
//                                 console.error('Error executing query:', err);
//                                 res.status(500).json({ error: 'An error occurred while registering the user.' });
//                             } else {
//                                 console.log("Third else...")
//                                 res.json({ message: 'User registered successfully.' });
//                             }
//                         }
//                     );
//                 }
//             }
//         }
//     );
// });


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

app.listen(5000, () => {
    console.log('Server listening on port 3001');
});

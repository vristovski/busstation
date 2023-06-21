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
                if (role === 'Passenger') {
                    registerPassenger(result);
                }
                res.json(result);
            }
        }
    );

    function registerPassenger(userID) {
        pool.query(
            'INSERT INTO "Busify"."Passenger" ("ID_User") VALUES ($1)',
            [userID],
            (err, queryRes) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'An error occurred while registering the passenger.' });
                } else {
                    console.log("Successfully registered the passenger.", queryRes);
                }
            }
        );
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT LoginUser($1, $2) AS result',
        [email, password],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while logging in.' });
            } else {
                const result = queryRes.rows[0].result;
                // res.json({ loggedIn: result});
                console.error('Successful');
                if(result){
                    pool.query(
                        'SELECT "ID_User" FROM "Busify"."User" WHERE "Email" = $1 AND "Password" = $2',
                        [email, password],
                        (err, userDataRes) => {
                            if (err) {
                                console.error('Error executing query:', err);
                                res.status(500).json({ error: 'An error occurred while fetching user data.' });
                            } else {
                                res.json({ loggedIn: result, userID: userDataRes.rows[0], email: email });
                            }
                        }
                    );
                }else {
                    res.json({ loggedIn: false, userID: null });
                }
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

app.post('/calculatePrice', (req, res) => {
    const { startLocation, endLocation } = req.body;
    console.log("req.body", req.body);
    // Call the searchRoute function in the database
    pool.query(
        'SELECT "Price" FROM Routes_With_Prices WHERE StartPoint = $1 AND EndPoint = $2',
        [startLocation, endLocation],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const price = queryRes.rows[0].Price;
                console.error('Successful: ', queryRes.rows[0].Price);
                res.json(price);
            }
        }
    );
});

app.post('/bookTicket', (req, res) => {
    const { userID, startLocation, endLocation, seat } = req.body;
    console.log("req.body", req.body);
    // Call the searchRoute function in the database
    pool.query(
        'SELECT BookTicket($1, $2, $3, $4) AS result',
        [userID, startLocation, endLocation, seat],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const ticket = queryRes.rows[0].result;
                console.error('Successful: ', queryRes.rows[0].result);
                res.json(ticket);
            }
        }
    );
});

app.post('/addBaggage', (req, res) => {
    const { ticketID, weight, size, baggageType } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT addBaggage($1, $2, $3, $4) AS baggageId',
        [ticketID, weight, size, baggageType],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while adding baggage.' });
            } else {
                const baggageId = queryRes.rows[0].baggageid;
                console.log("baggageId", queryRes.rows[0].baggageid);
                res.json({ baggageId });
            }
        }
    );
});


app.post('/addInsurance', (req, res) => {
    const { userID, companyID, Type, from, to } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT AddTravelInsurance($1, $2, $3, $4, $5) AS insuranceId',
        [userID, companyID, Type, from, to],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while adding travel insurance.' });
            } else {
                const insuranceId = queryRes.rows[0].insuranceid;
                console.log("insuranceId", queryRes.rows[0].insuranceid);
                res.json({ insuranceId });
            }
        }
    );
});

app.post('/getBusInfo', (req, res) => {
    const { ticketID } = req.body;
    console.log("req.body", req.body);
    // Call the searchRoute function in the database
    pool.query(
        'Select "Departure_Time", Company_Name from user_tickets where "ID_Ticket" = $1',
        [ticketID],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const result = queryRes.rows[0];
                console.error('Successful: ', queryRes.rows[0]);
                res.json(result);
            }
        }
    );
});

app.post('/getUserData', (req, res) => {
    const { userID } = req.body;
    console.log("req.body", req.body);
    pool.query(
        'Select * from "Busify"."User" where "ID_User" = $1',
        [userID],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const result = queryRes.rows[0];
                console.error('Successful: ', queryRes.rows[0]);
                res.json(result);
            }
        }
    );
});

app.post('/updateProfile', async (req, res) => {
    const { userID, email, firstName, lastName, dateOfBirth } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT updateprofile($1, $2, $3, $4, $5) AS result',
        [userID, firstName, lastName, email, dateOfBirth],
        (err, queryRes) => {
            if (err) {
                console.error('Error updating profile:', err);
                res.status(500).json({ error: 'Failed to update profile' });
            } else {
                console.log('Successful');
                res.json({ message: 'Profile updated successfully' });
            }
        }
    );
});




app.listen(5000, () => {
    console.log('Server listening on port 3001');
});

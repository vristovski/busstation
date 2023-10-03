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
                console.log(result);
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
                        'SELECT "ID_User", "Role" FROM "Busify"."User" WHERE "Email" = $1 AND "Password" = $2',
                        [email, password],
                        (err, userDataRes) => {
                            if (err) {
                                console.error('Error executing query:', err);
                                res.status(500).json({ error: 'An error occurred while fetching user data.' });
                            } else {
                                res.json({ loggedIn: result, userID: userDataRes.rows[0], email: email });
                                console.log("loggedIn", result);
                                console.log("userID",  userDataRes.rows[0]);
                                console.log("email", email);
                            }
                        }
                    );
                }else {
                    res.json({ loggedIn: false, userID: null });
                    console.log("loggedIn", false);
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
                //console.log("schedule", schedule);
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
                console.log('Successful: ', queryRes.rows);
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
                console.log('Successful: ', queryRes.rows[0].Price);
                res.json(price);
            }
        }
    );
});

app.post('/bookTicket', (req, res) => {
    const { userID, startLocation, endLocation, seat, tourdate } = req.body;
    console.log("req.body", req.body);
    // Call the searchRoute function in the database
    pool.query(
        'SELECT BookTicket($1, $2, $3, $4, $5) AS result',
        [userID, startLocation, endLocation, seat, tourdate],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const ticket = queryRes.rows[0].result;
                console.log('Successful: ', queryRes.rows[0].result);
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
                console.log('Successful: ', queryRes.rows[0]);
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
                console.log('Successful: ', queryRes.rows[0]);
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

app.post('/getFutureUserTickets', (req, res) => {
    const { userID } = req.body;
    console.log("req.body", req.body);
    pool.query(
        'Select * from user_tickets where "ID_User" = $1',
        [userID],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while calculating price.' });
            } else {
                const result = queryRes.rows;
                console.log('Successful: ', queryRes.rows);
                res.json(result);
            }
        }
    );
});


app.post('/addReview', (req, res) => {
    const { ID_Route, ID_Passenger, Review, Feedback } = req.body;
    console.log("req.body", req.body);

    pool.query(
        'SELECT AddReview($1, $2, $3, $4) AS reviewID',
        [ID_Route, ID_Passenger, Review, Feedback],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while adding travel insurance.' });
            } else {
                const reviewId = queryRes.rows[0].reviewid;
                console.log("reviewId", queryRes.rows[0].reviewid);
                res.json({ reviewId });
            }
        }
    );
});

app.get('/routeReviews', (req, res) => {
    // Query the database to fetch the schedule data
    pool.query(
        `SELECT * FROM Route_Review`,
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while fetching the reviews.' });
            } else {
                const reviews = queryRes.rows;
                console.log("reviews", queryRes.rows);
                res.json(reviews);
            }
        }
    );
});


function getNumberOfSeatsByCompanyId(id_company, callback) {
    pool.query(
        'SELECT "ID_Bus" FROM "Busify"."Bus" WHERE "ID_Bus_Company" = $1 LIMIT 1',
        [id_company],
        (err, queryRes) => {
            if (err) {
                console.error('Error getting bus ID:', err);
                callback(err, null);
            } else {
                const busID = queryRes.rows[0].ID_Bus; // Corrected the column name
                console.error('busID', busID);
                callback(null, busID);
            }
        }
    );
}

// Route to add a new route
app.post('/addRoute', async (req, res) => {
    const newRoute = req.body;

    try {
        getNumberOfSeatsByCompanyId(newRoute.ID_Bus_Company, (err, busID) => {
            if (err) {
                console.error('Error retrieving bus ID:', err);
                res.status(500).json({ error: 'An error occurred while retrieving the bus ID.' });
            } else {
                console.log("newRoute", newRoute);
                pool.query(
                    'INSERT INTO "Busify"."Route" ("ID_Bus", "Start_Point", "End_Point", "Arrival_Time", "Departure_Time", "Distance", "ID_Bus_Company") VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [
                        busID, // Use the retrieved busID here
                        newRoute.Start_Point,
                        newRoute.End_Point,
                        newRoute.Arrival_Time,
                        newRoute.Departure_Time,
                        newRoute.Distance,
                        newRoute.ID_Bus_Company,
                    ],
                    (err, queryRes) => {
                        if (err) {
                            console.error('Error adding new route:', err);
                            res.status(500).json({ error: 'An error occurred while adding the route.' });
                        } else {
                            console.log('New route added to the database');
                            res.json({ message: 'New route added successfully' });
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error('Error retrieving number of seats:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the number of seats.' });
    }
});

app.post('/editRoute', async (req, res) => {
    const { Start_Point, End_Point, Arrival_Time, Departure_Time, Distance, ID_Route } = req.body;
    console.log("req.body", req.body);
    pool.query(
        `UPDATE "Busify"."Route" SET "Start_Point" = $1, "End_Point" = $2, "Arrival_Time" = $3, "Departure_Time" = $4, "Distance" = $5 WHERE "ID_Route" = $6`,
        [Start_Point, End_Point, Arrival_Time, Departure_Time, Distance, ID_Route],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while fetching the reviews.' });
            } else {
                console.error('Success:', queryRes);
            }
        }
    );
});

app.post('/deleteRoute', async (req, res) => {
    const { ID_Route } = req.body;
    console.log("req.body for delete", req.body);
    pool.query(
        `DELETE FROM "Busify"."Route" WHERE "ID_Route" = $1`,
        [ID_Route],
        (err, queryRes) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'An error occurred while fetching the reviews.' });
            } else {
                console.error('Success:', queryRes);
            }
        }
    );
});

app.listen(5000, () => {
    console.log('Server listening on port 3001');
});

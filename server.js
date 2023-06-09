const { Pool } = require('pg');

const express = require('express');
const app = express();

// Create a new pool instance with the connection details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'sa',
    port: 5432,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
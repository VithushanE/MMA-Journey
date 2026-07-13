console.log("Starting MMA Tracker server...");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();




const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// PostgreSQL connection

const pool = new Pool({

    user: "vithushanesan",

    password: "password",

    host: "localhost",

    port: 5432,

    database: "postgres"

});


// Test route

app.get("/", (req, res) => {

    res.send("MMA Tracker API Running");

});


// Get training sessions


app.get("/api/training", async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM mma_training
            ORDER BY training_date DESC
            `
        );


        res.json(result.rows);


    } catch(error) {


        console.error(error);

        res.status(500).json({
            error:"Database connection failed"
        });


    }

});


// Add training session

app.post("/api/training", async (req, res) => {

    console.log("POST /api/training");
    console.log("Body:", req.body);

    const {
        training_date,
        martial_art,
        duration_minutes,
        notes
    } = req.body;


    console.log("Date being inserted:", training_date);
  
    try {

        const result = await pool.query(
            `
            INSERT INTO mma_training
            (
                training_date,
                martial_art,
                duration_minutes,
                notes
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [
                training_date,
                martial_art,
                duration_minutes,
                notes
            ]
        );

        console.log("Inserted:", result.rows[0]);

        res.json(result.rows[0]);

    } catch (error) {

        console.error("DATABASE ERROR:");
        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


// Start server

app.listen(3000, ()=>{

    console.log(
        "Server running on port 3000"
    );

});
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { connect } = require("./db-connection.js");
const { executeQuery } = require("./db-connection.js");
// const tripRoute = require("./routes/insertTripRoute");
const path = require("path");
 
app.use(bodyParser.json());
 
connect()
    .then((connection) => {
        console.log("Connected to the database.");
    })
    .catch((error) => {
        console.log("Database connection failed!");
        console.log(error);
    });
 
// app.post('/api', async (req, res) => {
//   try {
//   console.log('Request body received:', req.body); // Log request body
//     res.status(200).json({ message: 'Trip added successfully', result });
 
//   } catch (error) {
//     console.error('Error inserting trip:', error);
//     res.status(500).json({ error: 'An error occurred while inserting the trip' });
//   }
// });
 
app.post("/new-trip/api/trips", async (req, res) => {
    console.log("Request body received:", req.body); // Log request body
    const leaderId = 1;
 
    try {
        const {
            tripName,
            startDate,
            endDate,
            difficulty,
            distance,
            elevation,
            estimatedDuration,
            permitsRequired,
            // leaderId
        } = req.body;
 
        // Query or Stored Procedure to insert the trip
        const query = "InsertTrip"; // Replace with your stored procedure name or query
        const values = [
            tripName,
            startDate,
            endDate,
            difficulty,
            distance,
            elevation,
            estimatedDuration,
            permitsRequired,
            leaderId,
        ];
        const paramNames = [
            "tripName",
            "SDate",
            "EDate",
            "difficulty",
            "distance",
            "elevation",
            "estimatedDuration",
            "permitsRequired",
            "leaderId",
        ];
 
        // Execute the query
        const result = await executeQuery(query, values, paramNames, true); // Assuming it's a stored procedure
 
        res.status(200).json({ message: "Trip added successfully", result });
    } catch (error) {
        console.error("Error inserting trip:", error);
        res
            .status(500)
            .json({ error: "An error occurred while inserting the trip" });
    }
});
 
app.use("/", express.static("../"));
 
const PORT = 5000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
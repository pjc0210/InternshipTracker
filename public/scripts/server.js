const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { connect } = require("./db-connection.js");
const { executeQuery } = require("./db-connection.js");
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

/*GET Requests*/
app.get("/new-internship/api/internships", async (req, res) => {
    console.log("Request body received:", req.body); // Log request body

    try {
        //Not using a stored procedure, simply running a SELECT
        const result = await executeQuery("SELECT * FROM Internship", [], [], false);

        res.status(200).json(result.recordset); // Return internships
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).json({ error: "Failed to retrieve internships" });
    }
});


/*POST Requests*/

//addInternship
app.post("/new-internship/api/internships", async (req, res) => {
    console.log("Request body received:", req.body); // Log request body

    try {
        const {
            companyID,
            title,
            industry,
            setting,
            url,
            duration,
            jobType,
            deadline,
        } = req.body;

        // Query or Stored Procedure to insert the trip
        const query = "addInternship"; // Replace with your stored procedure name or query
        const values = [
            companyID,
            title,
            industry,
            setting,
            url,
            duration,
            jobType,
            deadline,
        ];
        const paramNames = [
            "companyID",
            "title",
            "industry",
            "setting",
            "url",
            "duration",
            "jobType",
            "deadline",
        ];

        // Execute the query
        // Assuming it's a stored procedure:
        const result = await executeQuery(query, values, paramNames, true, "internshipID");

        //Extract the internshipID from result.output
        const internshipID = result.output?.internshipID || null;

        console.log(result);

        res.status(200).json({
            message: "Internship added successfully",
            internshipID: internshipID,
            result
        });
    } catch (error) {
        console.error("Error inserting internship:", error);
        res
            .status(500)
            .json({
                error: "An error occurred while inserting the internship"
            });
    }
});


/*HOSTING INFORMATION */
app.use("/", express.static("../"));

const PORT = 5000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
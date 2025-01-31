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
app.get("/api/get-internships", async (req, res) => {
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

app.get("/api/get-company", async (req, res) => {
    //Log request body
    console.log("Request body received:", req.body);
    //Extract query parameters
    const { name, website } = req.query;
    // Validate query parameters
    if (!name || !website) {
        return res.status(400).json({ error: "Missing name or website parameter" });
    }

    try {
        //Not using a stored procedure, simply running a SELECT
        //We have to do some replacements on the website so that it looks like a proper URL again
        const result = await executeQuery(`SELECT * 
                                           FROM Company
                                           WHERE Name = @Name AND 
                                                 REPLACE(REPLACE(RTRIM(LTRIM(Website)), 'http://', ''), 'https://', '') LIKE @Website`, 
                            [name, website], ["Name", "Website"], false);

        res.status(200).json(result.recordset); // Return internships
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ error: "Failed to retrieve company" });
    }
});


/*POST Requests*/

//addInternship
app.post("/api/add-internship", async (req, res) => {
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

//addCompany
app.post("/api/add-company", async (req, res) => {
    console.log("Request body received:", req.body); // Log request body

    try {
        const {
            Name,
            HeadquartersLocation,
            Website,
        } = req.body;

        // Query or Stored Procedure to insert the trip
        const query = "addCompany"; // Replace with your stored procedure name or query
        const values = [
            Name,
            HeadquartersLocation,
            Website,
        ];
        const paramNames = [
            "Name",
            "HeadquartersLocation",
            "Website",
        ];

        // Execute the query
        // Assuming it's a stored procedure:
        const result = await executeQuery(query, values, paramNames, true, "companyID");

        //Extract the internshipID from result.output
        const companyID = result.output?.companyID || null;

        console.log(result);

        res.status(200).json({
            message: "Company added successfully",
            companyID: companyID,
            result
        });
    } catch (error) {
        console.error("Error inserting company:", error);
        res
            .status(500)
            .json({
                error: "An error occurred while inserting the company"
            });
    }
});


/*HOSTING INFORMATION */
app.use("/", express.static("../"));

const PORT = 5000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
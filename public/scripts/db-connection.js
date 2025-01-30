/**
 *  Script file for connecting the SQL database to our website
 */

// Name Space => internship tracker
var it = it || {};

const sql = require("mssql");

it.SERVER_NAME = 'golem.csse.rose-hulman.edu';
it.DB_NAME = 'InternshipTracker_S3G6';
it.DRIVER = 'ODBC Driver 17 for SQL Server';
it.DB_MANAGER_NAME = 'InternshipManager';
it.DB_MANAGER_PASS = 'password';

const config = {
    server: it.SERVER_NAME,
    database: it.DB_NAME,
    driver: it.DRIVER,
    user: it.DB_MANAGER_NAME,
    password: it.DB_MANAGER_PASS,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

//Function to connect to the database
async function connect() {
    try {
        let pool = await sql.connect(config);
        console.log("Connected to the database.");
        return pool;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

/* Executes the inputted SQL query */
async function executeQuery(query, values = [], paramNames = [], isStoredProcedure = true, outputParamName = null) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        if (values && paramNames) {
            for (let i = 0; i < values.length; i++) {
                request.input(paramNames[i], values[i]);
            }
        }

        if (outputParamName) {
            request.output(outputParamName, sql.Int);
        }

        values.forEach((val, index) => {
            if (typeof val === 'undefined') {
                console.error(`Undefined value found for ${paramNames[index]}`);
            }
        });

        let result;
        if (isStoredProcedure) {
            result = await request.execute(query);
        } else {
            result = await request.batch(query);
        }

        if (outputParamName) {
            result = {
                ...result,
                [outputParamName]: request.parameters[outputParamName].value
            };
        }

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Export the functions
module.exports = {
    connect,
    executeQuery
};
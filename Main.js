/**
 *  Script file for connecting the SQL database to the front end
 */
 
// Name Space => internship tracker
var it = it || {};
 
it.intializeDBConnection = function () {
 
    const sql = require('mssql');
 
    const pool = new sql.ConnectionPool({
        server: 'golem.csse.rose-hulman.edu',
        database: 'OutdoorAdventureMgmtSys',
        driver: 'ODBC Driver 17 for SQL Server',
        user: 'BackpackingManager', //Replace with our user
        password: 'BackpackingIsFun!', //Replace with our user password
        options: {
             trustServerCertificate: true
        }
    });
   
    pool.connect()
        .then(() => {
 
            console.log('Connected to MSSQL');
 
            const query = `
            INSERT INTO Food (FoodID)
            VALUES (@value1)`;
 
            return pool.request()
            .input('value1', sql.Int, 12345)             // Replace with actual values
            .query(query);
               
        })
        .then(result => {
            console.log(result.recordset);
        })
        .catch(err => {
            console.error('Database connection error:', err);
        });
   
 
};
 
 
/* Main */
it.main = function () {
    it.intializeDBConnection();
};
 
it.main();
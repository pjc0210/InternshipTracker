/**
 *  Script file for connecting the SQL database to the front end
 */
 
// Name Space => internship tracker
var it = it || {};

it.SERVER_NAME = 'golem.csse.rose-hulman.edu';
it.DB_NAME = 'InternshipTracker_S3G6';
it.DRIVER = 'ODBC Driver 17 for SQL Server';
it.DB_MANAGER_NAME = 'InternshipManager';
it.DB_MANAGER_PASS = 'password';
 
it.intializeDBConnection = function () {
 
    const sql = require('mssql');
 
    const pool = new sql.ConnectionPool({
        server: it.SERVER_NAME,
        database: it.DB_NAME,
        driver: it.DRIVER,
        user: it.DB_MANAGER_NAME, //Replace with our user
        password: it.DB_MANAGER_PASS, //Replace with our user password
        options: {
             trustServerCertificate: true
        }
    });
    
};
 
 
/* Main */
it.main = function () {
    it.intializeDBConnection();

    //Testing code to call addCompany
    it.executeQuery(`EXEC dbo.addCompany`

    )
};

/*Creates the proper Manager and Controller objects for the given
page the application is on
*/
it.init = function () {

    const urlParams = new URLSearchParams(window.location.search);
    //TODO: Initialize the pages for the InternshipTracker app
    //TODO: Delete old placeholder code from ShelterManager app

    if (document.querySelector("#listPage")) {
        new app.SideNavController();
    }

    if (document.querySelector("#loginPage")) {

        console.log("You are on the login page");
        app.loginPageController = new app.LoginPageController();

    }

    if (document.querySelector("#signupPage")) {

        console.log("You are on the signup page.");
        app.shelterListManager = new app.ShelterListManager();
        app.signupPageController = new app.SignupPageController();

    }

    if (document.querySelector("#listPage")) {

        console.log("You are on the list page");
        const email = urlParams.get("uid");
        app.petListManager = new app.PetListManager(email);
        app.listPageController = new app.ListPageController();

    }

    if (document.querySelector("#detailPage")) {

        console.log("You are on the detail page");
        const petID = urlParams.get('id');
        app.petManager = new app.PetManager(petID);
        app.detailPageController = new app.DetailPageController();

    }

    if (document.querySelector("#profilePage")) {

        console.log("You are on the profile page");
        const shelterId = urlParams.get('uid')
        app.shelterManager = new app.ShelterManager(shelterId);
        app.profilePageController = new app.ProfilePageController();

    }

};

/*Checks for certain conditions that must be satisfied on some pages. 
For example, to be on the main page, the user must be signed in, so this function
checks that the user is correctly signed in.
*/
it.checkForRedirect = function () {

    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    //TODO: Don't use Firebase for auth, use Express for hosting
    //TODO: Change redirects from old SheterManager redirects to InternshipTracker redirects

    if (!uid && app.fbAuthManager.isSignedIn && document.querySelector("#listPage")) {
        window.location.href = `/index.html?uid=${app.fbAuthManager.userId}`;
    }

    // if signed in and on login or signup pages, redirect to list page
    if ((app.fbAuthManager.isSignedIn && document.querySelector("#loginPage")) || 
        (app.fbAuthManager.isSignedIn && document.querySelector("#signupPage"))) {
        window.location.href = `/index.html?uid=${app.fbAuthManager.userId}`;
    }

};

/**
 * Converts an HTML string into a DOM element.
 *
 * @param {string} html - The HTML string to convert.
 * @return {Element} The DOM element created from the HTML string.
 */
function htmlToElement(html) {

    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;

    return template.content.firstChild;

}

/* Executes the inputted SQL query */
async function executeQuery(query, values=[], paramNames=[], isStoredProcedure=true, outputParamName=null) {
    try{
        const pool = await sql.connect(config);
        const request = pool.request();

        if(values && paramNames){
            for(let i=0; i<values.length; i++){
                request.input(paramNames[i], values[i]);
            }
        }

        if(outputParamName){
            request.output(outputParamName, sql.Int);
        }

        values.forEach((val,index) => {
            if(typeof val === 'undefined'){
                console.error(`Undefined value found for ${paramNames[index]}`);
            }
        });

        let result;
        if(isStoredProcedure){
            result = await request.execute(query);
        } else {
            result = await request.batch(query);
        }

        if(outputParamName){
            result = {...result, [outputParamName]: request.parameters[outputParamName].value};
        }

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
 
it.main();
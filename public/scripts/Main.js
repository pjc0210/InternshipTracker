/**
 *  Script file for connecting the SQL database to the front end
 */

// Name Space => front-end manager
var fem = fem || {};

fem.authManager = null;
fem.internshipPage = null;


/* Main */
fem.main = function () {
    fem.checkForRedirect();
    fem.init();
};

/*Creates the proper Manager and Controller objects for the given
page the application is on
*/
fem.init = function () {

    const urlParams = new URLSearchParams(window.location.search);

    if (document.querySelector("#addInternshipPage")) {
        fem.internshipPage = new fem.InternshipPage();
    }

    /*
    if (document.querySelector("#listPage")) {

        console.log("You are on the list page");
        const email = urlParams.get("uid");
        app.petListManager = new app.PetListManager(email);
        app.listPageController = new app.ListPageController();

    }
        */
};

/*Checks for certain conditions that must be satisfied on some pages. 
For example, to be on the main page, the user must be signed in, so this function
checks that the user is correctly signed in.
*/
fem.checkForRedirect = function () {

    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');

    //TODO: Don't use Firebase for auth, use Express for hosting
    //TODO: Change redirects from old SheterManager redirects to InternshipTracker redirects

    // if (!uid && app.fbAuthManager.isSignedIn && document.querySelector("#listPage")) {
    //     window.location.href = `/index.html?uid=${app.fbAuthManager.userId}`;
    // }

    // // if signed in and on login or signup pages, redirect to list page
    // if ((app.fbAuthManager.isSignedIn && document.querySelector("#loginPage")) ||
    //     (app.fbAuthManager.isSignedIn && document.querySelector("#signupPage"))) {
    //     window.location.href = `/index.html?uid=${app.fbAuthManager.userId}`;
    // }

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

/*Classes*/
fem.InternshipPage = class {
    constructor() {

        console.log("InternshipPage javascript created");

        document.querySelector("#create").onclick = async () => {

            console.log("Create button clicked!");

            const title = document.getElementById("title").value;
            const industry = document.getElementById("industry").value;
            const setting = document.getElementById("setting").value;
            const url = document.getElementById("url").value;
            const duration = document.getElementById("duration").value;
            const jobType = document.getElementById("jobType").value;
            const companyName = document.getElementById("companyName").value;
            const country = document.getElementById("country").value;
            const city = document.getElementById("city").value;
            const state = document.getElementById("state").value;
            const deadline = document.getElementById("deadline").value;
            const status = document.getElementById("status").value;
            const notes = document.getElementById("notes").value;

            const companyID = 3000;

            //Parse the request body
            const requestBody = {
                companyID,
                title,
                industry,
                setting,
                url,
                duration,
                jobType,
                deadline,
            };

            //Send the fetch request
            try {
                const response = await fetch("/new-internship/api/internships", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                const result = await response.json();
                if (response.ok) {
                    console.log("Internship added successfully: ", result);
                } else {
                    console.error("Error adding internship: ", result.error);
                }
            } catch (error) {
                console.error("Error sending request: ", error);
            }
        }
    }
}

fem.main();
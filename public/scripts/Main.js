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

        document.addEventListener("DOMContentLoaded", async () => {
            try {
                //Fetch the internships from the server
                const response = await fetch("/new-internship/api/internships");
                const data = await response.json();

                console.log("Received API Data:", data); //Debugging log

                //Check if response is valid
                if(!response.ok){
                    console.error("Failed to fetch internships: ", data.error);
                    return;
                }

                //Select the table container
                const tableContainer = document.getElementById("internshipTable");
                if(!tableContainer){
                    console.error("Table element with ID 'internshipTable' not found.");
                    return;
                }

                //Build the table
                const table = htmlToElement(`
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Industry</th>
                                <th>Setting</th>
                                <th>Website URL</th>
                                <th>Duration</th>
                                <th>Job Type</th>
                                <th>Deadline</th>
                            </tr>
                        </thread>
                        <tbody id="internshipTableBody"></tbody>
                    </table>
                `);

                //Append the table to the container
                tableContainer.innerHTML = "";
                tableContainer.appendChild(table);

                //Select tbody for row insertion
                const tbody = document.getElementById("internshipTableBody");

                //Loop through the internships and append rows
                data.forEach(internship => {
                    console.log("Processing internship:", internship); // Debugging log
                    const row = htmlToElement(`
                        <tr>
                            <td>${internship.ID ?? "N/A"}</td>
                            <td>${internship.Title ?? "N/A"}</td>
                            <td>${internship.CompanyID ?? "N/A"}</td>
                            <td>${internship.Industry ?? "N/A"}</td>
                            <td>${internship.Setting ?? "N/A"}</td>
                            <td>${internship.URL ?? "N/A"}</td>
                            <td>${internship.Duration ?? "N/A"}</td>
                            <td>${internship.JobType ?? "N/A"}</td>
                            <td>${internship.Deadline ?? "N/A"}</td>
                    `);
                    tbody.appendChild(row);
                });
            } catch(error) {
                console.error("Error fetching internships: ", error);
                document.getElementById("internshipTable").innerHTML = `<p style="color: red;">Failed to load internships.</p>`;
            }
        });

        //Create button functionality
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
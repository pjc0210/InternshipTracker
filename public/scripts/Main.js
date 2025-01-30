/**
 *  Script file for connecting the SQL database to the front end
 */
 
// Name Space => front-end manager
var fem = fem || {};

fem.authManager = null;
 
 
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
        fem.InternshipPage = new fem.InternshipPage();
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

/*Classes*/
fem.InternshipPage = class {
    constructor() {

        console.log("InternshipPage javascript created");

        document.querySelector("#submitCreateInternship").onclick = () => {

            const email = document.getElementById("signupEmailInput").value;
            const password = document.getElementById("passwordInput").value;
            const name = document.getElementById("shelterNameInput").value;
            const location = document.getElementById("shelterLocationInput").value;
            const description = document.getElementById("shelterDescriptionInput").value;
            const website = document.getElementById("shelterLinkInput").value;

            uploadShelterImage(email, password, name, website, location, description);
        }
    }
}
 
fem.main();
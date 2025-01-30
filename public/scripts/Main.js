/**
 *  Script file for connecting the SQL database to the front end
 */
 
// Name Space => application
var app = app || {};

it.authManager = null;
 
 
/* Main */
it.main = function () {
    intializeDBConnection();

    //Testing code to call addCompany
    it.executeQuery(`EXEC dbo.addCompany`

    )
};

/*Classes*/
/*Manager for authorization in the app*/
it.AuthManager = class {

    //TODO: Replace old ShelterManager code with InternshipTracker code

    constructor() {

        console.log("AuthManager created");

        this._user = null;
        this.email = null;
        this.userId = null;

    }

    beginListening(changeListener) {

        firebase.auth().onAuthStateChanged((user) => {

            console.log("FIREBASE: User state changed. User: ", user);

            this._user = user;
 
            if (user) {

                console.log("Signed in as: ", user.email);

                this.userId = user.uid;
                this.email = user.email;

            }
            else {
                console.log("Signed out");
            }

            changeListener();

        });

    }

    signIn(email, password) {

        console.log("Signing in as: ", email);

        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;

            console.error("Existing account login error: ", errorCode, errorMessage);

        })
        .then(() => {
            window.location.href = `/index.html${this._user.uid}`;
        });

    }

    signUp(email, password, name, website, location, description, photoURL) {

        console.log("Signing up as: ", email);

        app.shelterListManager.add(email, name, website, location, description, photoURL);

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            console.error("Create account error: ", error);
        });

    }

    signOut() {

        console.log("Signing out...");

        firebase.auth().signOut().catch((error) => {
            console.error("Sign out error: ", error);
        });

    }

    get isSignedIn() {
        return !!this._user;
    }

    get uid() {
        return this._user.uid;
    }

}

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
 
it.main();
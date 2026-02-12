import { User } from "./models/User.js";
import { Alert } from "./utils/alert.js";
import { Store } from "./utils/store.js";

const showError = (text) => {
    document.getElementById("signupError").innerText = text;
}
export const isUniqueUsername = (username, userId = null) => {
    /**
     * Will be used in signup and edit profile
     * Accepts a username and checks if it is not a duplicate then returns the result
     * @param {string} username
     * @param {string} userId - optional: if the user is already logged in, to filter them out
     * @returns {boolean} - The result
    */
    let users = new Store("users").getAll();

    if (users.length == 0) {
        //no users
        return true;
    }

    if (userId) {
        users = users.filter(user => user.id != userId);
    }

    //return the opposite of if the username already exists.
    return !users.some(user => user.username == username.trim());
}

const handleSubmit = (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const surname = document.getElementById("surname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const alert = new Alert();

    //make sure that the username is indeed unique
    if (isUniqueUsername(username)) {
        //continue
        
        if (firstName.length && surname.length && username.length && password.length) {
            const userStore = new Store("users");
            const user = new User(firstName, surname, username, password);
            userStore.insert(user);
            alert.show("success", "Successfully created an account, redirecting");
            sessionStorage.setItem("session", JSON.stringify(user));
            location.href = "./chat.html";
        }
        else {
            alert.show("error","Please enter all the required information.");
        }
    }
    else {
        alert.show("error","Username already exists, try a different one.")
    }


}

//event listeners
if (location.href.includes("signup.html")) {
    document.querySelector("#signupForm").addEventListener("submit", (e) => handleSubmit(e))
}

import { User } from "./models/User.js";
import { Alert } from "./utils/alert.js";
import { Store } from "./utils/store.js";

function showError(text) {
    document.getElementById("signupError").innerText = text;
}
function validateUsername(username) {
    /**
     * Will be used in signup and edit profile
     * Accepts a username and checks if it is not a duplicate then returns the result
     * @param {string} username
     * @returns {boolean} - The result
    */
    const rawData = localStorage.getItem("users");
    const users = rawData ? JSON.parse(rawData) : []; 

    if (users.length == 0) {
        //no users
        return true;
    }

    //return the opposite of if the username already exists.
    return !users.some(user => user.username == username);
}

function handleSubmit(e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const surname = document.getElementById("surname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const alert = new Alert();

    //make sure that the username is indeed unique
    if (validateUsername(username)) {
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

document.querySelector("#signupForm").addEventListener("submit", (e) => handleSubmit(e))

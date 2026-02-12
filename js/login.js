import { Alert } from "./utils/alert.js";
import { Store } from "./utils/store.js";

//event listeners
document.getElementById("loginForm").addEventListener("submit", (e) => handleSubmit(e));


const handleSubmit = (e) => {
    const alert = new Alert();
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userStore = new Store("users");
    const user = userStore.getAll().find(user => user.username == username);
    if (user) {
        //decrypt the password
        if (atob(user.password) == password) {
            sessionStorage.setItem("session", JSON.stringify(user));
            alert.show("success", "Logged in successfully, redirecting...")
            location.href = "../pages/chat.html";
        }
        else {
            alert.show("error", "Wrong password");
        }
        return;
    }

    alert.show("error", "No user exists for this username");
    return;
}
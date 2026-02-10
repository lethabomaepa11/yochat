import { Store } from "./utils/store.js";

//event listeners
document.getElementById("loginForm").addEventListener("submit", (e) => handleSubmit(e));


function handleSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userStore = new Store("users");
    const user = userStore.getAll().find(user => user.username == username);
    if (user) {
        //decrypt the password
        if (user.password == password) {
            location.href = "../pages/chat.html";
        }
        else {
            alert("Wrong Password");
        }
        return;
    }

    alert("No user exists for this username");
    return;
}
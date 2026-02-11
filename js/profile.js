import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat } from "./models/Chat.js";


//global variables/elements
const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));

//event listeners
document.addEventListener("load", showUserProfile());

function toggleView() {
    if (window.innerWidth > 700) {
        //desktop, just skip this method
        return;
    }
    //middleView is currently active
    middleView.style.display = "none";
    mainView.style.display = "block";
}

function showUserProfile() {
    const userStore = new Store("users");
    const user = userStore.getAll().find(usr => usr.id == sessionUser.id);
    if (user) {
        //toggle the view on mobile
        toggleView();
        //show the person on the main view
        mainView.classList.add("flex", "flex-col", "items-center", "justify-center");
        mainView.innerHTML = `
            <div class="${window.innerWidth > 700 ? "card": ""} card-sm flex flex-col items-center justify-center">
                <p class="text-xs text-grey" style="margin: 0;">@${user.username}</p>
                <img src="../assets/images/avatar.jpg" alt="${user.username}" class="avatar" style="width: 100px;height: 100px;"/>
                <p>${user.firstName} ${user.surname}</p>
                <p class="text-success text-xs"><b>Online</b></p>
                <button class="bg-primary" onclick="updateProfile()">Update</button>
            </div>
        `
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }
}


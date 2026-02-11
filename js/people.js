import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"


//global variables/elements
const peopleList = document.getElementById("peopleList");
const searchInput = document.getElementById("searchInput");
const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");

//event listeners
document.addEventListener("load", getUsers());
searchInput.addEventListener("change", (e) => getUsers(searchInput.value));


function getUsers(key = "*") {
    const userStore = new Store("users");
    let result = [];
    if (key == "*" || key.toLowerCase() == "all") {
        //show all
        result = userStore.getAll();
    }
    else {
        key = key.toLowerCase().trim();
        result = userStore.getAll().filter(user => user.username.toLowerCase().includes(key) || user.firstName.toLowerCase().includes(key) || user.surname.toLowerCase().includes(key));
    }
    //filter by key

    displayUsers(result)
}
function displayUsers(users = []) {
    peopleList.replaceChildren();//clearing items

    //if no users are found
    if (!users.length) {
        const message = document.createElement("p");
        message.innerText = "No users found.";
        peopleList.appendChild(message);
        return;
    }

    //display the users
    const list = document.createElement("ul");
    users.forEach(user => {
        const item = document.createElement("li");
        item.addEventListener("click", () => showSelectedUser(user.id))
        item.innerHTML =
            `<div id='${user.username}' class='chat-list-item'>
                <img class='avatar' src='../assets/images/avatar.jpg'/>
                <span>
                    <p>${user.firstName} ${user.surname}</p>
                    <p class='text-success text-xs'>Online</p>
                </span>
            </div>`
        list.appendChild(item);
    })
    //append the list to the parent node
    peopleList.appendChild(list);

}
function toggleView() {
    if (window.innerWidth > 700) {
        //desktop, just skip this method
        return;
    }
    //main is currently active
    if (middleView.style.display == "none") {
        middleView.style.display = "flex";
        mainView.style.display = "none";
        return;
    }
    //middleView is currently active
    middleView.style.display = "none";
    mainView.style.display = "block";
}
function showSelectedUser(userId) {
    const userStore = new Store("users");
    const user = userStore.getAll().find(usr => usr.id == userId);
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
                <button class="bg-primary">Say Hi!</button>
            </div>
        `
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }
}
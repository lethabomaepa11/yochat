import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat } from "./models/Chat.js";
import { getMutualGroups } from "./groups.js";
import { getImageUrl } from "./utils/images.js";
import UserView from "./templates/UserView.js";


//global variables/elements
const peopleList = document.getElementById("peopleList");
const searchInput = document.getElementById("searchInput");
const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));
const chatStore = new Store("chats");

const getUsers = (key = "*") => {
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
const displayUsers = (users = []) => {
    peopleList?.replaceChildren();//clearing items

    //getting the session
    const sessionUser = JSON.parse(sessionStorage.getItem("session"));

    //if no users are found
    if (!users.length) {
        const message = document.createElement("p");
        message.innerText = "No users found.";
        peopleList?.appendChild(message);
        return;
    }

    //display the users
    const list = document.createElement("ul");
    const onlineUsers = new Store("online").getAll();
    users.forEach(async(user) => {
        const item = document.createElement("li");
        
        item.addEventListener("click", () => showSelectedUser(user.id))
        item.innerHTML =
            `<div id='${user.username}' class='chat-list-item'>
                <img class='avatar' src='${await getImageUrl(user.id)}'/>
                <span>
                    <p>${user.firstName} ${user.surname} ${sessionUser.id == user.id ? "(You)":""}</p>
                    <p class='${onlineUsers.includes(user.id) ? 'text-success' : 'text-error'} text-xs'>
                        ${onlineUsers.includes(user.id) ? 'online' : 'offline'}
                    </p>
                </span>
            </div>`
        list.appendChild(item);
    })
    //append the list to the parent node
    peopleList?.appendChild(list);

}
//event listeners
document.addEventListener("load", getUsers());
searchInput.addEventListener("change", (e) => getUsers(searchInput.value));

window.addEventListener("storage", (e) => {
    if (e.key == "online") {
        getUsers();
    }
})




export const toggleView = () => {
    if (window.innerWidth > 700) {
        //desktop, just skip this method
        return;
    }
    //main is currently active
    if (middleView.style.display == "none") {
        //bottom nav needs to be gone
        document.getElementById("bottomNav").style.display = "grid";
        middleView.style.display = "flex";
        mainView.style.display = "none";
        return;
    }
    //middleView is currently active
    document.getElementById("bottomNav").style.display = "none";
    middleView.style.display = "none";
    mainView.style.display = "block";
}
// create a private chat
export const initiateChat = (userId) => {
    const chat = new Chat([userId, sessionUser?.id]);
    const alert = new Alert();
    const chats = chatStore.getAll().filter(c => c.users.includes(sessionUser.id));

    //check if the chat between the two does not exist
    if (chats.some(c => c.users.includes(userId) && c.type != "group")) {
        location.href = './chat.html';
        return;
    }
    chatStore.insert(chat);
    location.href = `./chat.html?c=${chat.id}`;
}

window.initiateChat = initiateChat;

const showSelectedUser = async(userId) => {

    const alert = new Alert();
    if (userId == sessionUser.id) {
        alert.show("error", "Cannot create a chat with yourself");
        return;
    }
    const userStore = new Store("users");
    const user = userStore.getAll().find(usr => usr.id == userId);
    if (user) {
        //toggle the view on mobile
        toggleView();
        const mutualGroups = getMutualGroups(userId);
        const isOnline = new Store("online").getAll().includes(userId);
        //show the person on the main view
        mainView.classList.add("flex", "flex-col", "items-center", "justify-center");
        mainView.innerHTML = await UserView({ user, getImageUrl, mutualGroups, isOnline });
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }
}


import { Chat } from "./models/Chat.js";
import { Alert } from "./utils/alert.js";
import { Store } from "./utils/store.js";


const sessionUser = JSON.parse(sessionStorage.getItem("session"));
const alert = new Alert();
const chatStore = new Store("chats");
let selectedUsers = [];

window.createGroupChat = createGroupChat;
// Create a group chat
function createGroupChat() {
    const users = selectedUsers;
    const name = document.getElementById("groupNameInput").value;
    if (!name) {
        alert.show("error", "Group name cannot be empty");
        return;
    }
    if (selectedUsers.length < 2) {
        alert.show("error", "Group needs 2 or more people");
        return;
    }
    const chat = new Chat([sessionUser?.id, ...users], "group", name);
    
    chatStore.insert(chat);
    location.href = `./groups.html?c=${chat.id}`;
}


window.toggleModal = () => {
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("modal");

    if (modal.style.display == "none") {
        modal.style.display = "flex";
        overlay.style.display = "flex";
        renderUsers();
    }
    else {
        modal.style.display = "none";
        overlay.style.display = "none";
    }
}

function toggleUserSelection(userId) {
    //add or remove the selected userId
    if (selectedUsers.includes(userId)) {
        selectedUsers = selectedUsers.filter(id => id != userId);
    }
    else {
        selectedUsers.push(userId);
    }
    renderUsers();
}

function renderUsers() {
    //render users that we can add to the chat, except this user
    const userStore = new Store("users");
    const users = userStore.getAll().filter(user => user.id != sessionUser.id);
    const list = document.createElement("ul");
    users.forEach(user => {
        //create an element for each user
        const item = document.createElement("li");
        item.addEventListener("click", () => toggleUserSelection(user.id))
        item.innerHTML =
            `<div id='${user.username}' class='chat-list-item ${selectedUsers.includes(user.id) ? "bg-primary" : ""}'>
                <img class='avatar' src='../assets/images/avatar.jpg'/>
                <span>
                    <p>${user.firstName} ${user.surname}</p>
                </span>
            </div>`
        
        list.appendChild(item);
    })
    document.getElementById("availUsers").replaceChildren(list);
}
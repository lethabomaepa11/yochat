import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat, Message } from "./models/Chat.js";


//global variables/elements
const chatList = document.getElementById("chatList");
const searchInput = document.getElementById("searchInput");
const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const messagesView = document.getElementById("messagesView");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));
const chatStore = new Store("chats");
const userStore = new Store("users");


//event listeners
document.addEventListener("load", displayChats());
searchInput.addEventListener("change", (e) => getUsers(searchInput.value));



function displayChats() {
    chatList.replaceChildren();//clearing items
    //get chats that this user is in
    const chats = chatStore.getAll().filter(c => c.users.includes(sessionUser.id));
    //if no chats are found
    if (!chats.length) {
        const message = document.createElement("p");
        message.innerText = "No chats yet.";
        chatList.appendChild(message);
        return;
    }

    //display the chats
    const list = document.createElement("ul");
    chats.forEach(chat => {
        //create an element for each chat
        const item = document.createElement("li");
        
        const userId = chat.users.find(id => id != sessionUser.id);
        const user = userStore.getAll().find(u => u.id == userId);
        item.addEventListener("click", () => showSelectedChat(chat.id))
        item.innerHTML =
            `<div id='${user.username}' class='chat-list-item'>
                <img class='avatar' src='../assets/images/avatar.jpg'/>
                <span>
                    <p>${user.firstName} ${user.surname} ${sessionUser.id == user.id ? "(You)":""}</p>
                    <p class='text-grey text-xs'>Message</p>
                </span>
            </div>`
        list.appendChild(item);
    })
    //append the list to the parent node
    chatList.appendChild(list);

}
function toggleView() {
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
function initiateChat(userId) {
    const sessionUser = JSON.parse(sessionStorage.getItem("session"));
    const chat = new Chat([userId, sessionUser?.id]);
    const alert = new Alert();
    const chats = chatStore.getAll();

    //check if the chat between the two does not exist
    if (chats.some(c => c.users.includes(sessionUser.id)) && chats.some(c => c.users.includes(userId))) {
        location.href = './chat.html';
        return;
    }
    chatStore.insert(chat);
    location.href = `./chat.html?c=${chat.id}`;
}

//link to the window
window.initiateChat = initiateChat;
window.toggleView = toggleView;
window.sendMessage = sendMessage;

function showSelectedChat(chatId) {
    const chat = chatStore.getAll().find(c => c.id == chatId);
    const userId = chat.users.find(id => id != sessionUser.id);
    const user = userStore.getAll().find(u => u.id == userId);
    if (chat) {
        //toggle the view on mobile
        toggleView();
        //show the person on the main view
        mainView.classList.add("flex", "flex-col", "items-center");
        //add the elements to the chatHeader
        document.getElementById("chatHeader").innerHTML = `
            <a href="./chat.html" style="color: white"><i class="fa fa-arrow-left"></i></a>
            <img class='avatar' src='../assets/images/avatar.jpg' />
            <span>
                <p>${user.firstName} ${user.surname}</p>
                ${user.isOnline ? `<p class='text-success text-xs'></p>` : `<p class='text-error text-xs'>Offline</p>`}
            </span>   
        `
        //display the chat input container
        document.getElementById("chatInputContainer").style.display = "flex";
        //insert its contents
        document.getElementById("chatInputContainer").innerHTML = `
            <textarea type="text" name="chatInput" id="chatInput"></textarea>
            <button class="bg-primary" onclick="sendMessage('${chat.id}')">Send</button>
        `

        renderMessages(chat);
        
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }
}

function renderMessages(chat, append = false, message = null) {

    /**
     * Renders messages on the DOM
     * if append is true, message must be an object, it will append message into the dom instead of replacing all elements
     */

    if (append && !message) {
        throw Error("If Append is true, message is required.");
    }
    if (append && message) {
        let element = document.createElement("div");

        //check the type, is it sent to or from this user
        element.innerHTML = `
        <div class="message-container">
            <div id="message${message.senderId == sessionUser.id ? "From" : "To"}" class="message">
                <p>${message.content}</p>
                <p class="text-xs">${message.time}</p>
            </div>
        </div>
        `
        messagesView.appendChild(element);
        return;
    }
    //if no messages are there yet
    if (!chat.messages?.length) {
        messagesView.innerHTML = `
        <div class="flex flex-col items-center justify-center" style="margin-top: 20px;">
            <h2>Say Hi!</h2>
            <p>There are no messages in here yet.</p>
        </div>
        `
        return;
    }

    const messages = [];
    //sort the messages 
    chat.messages?.forEach(message => {
        let element = document.createElement("div");

        //check the type, is it sent to or from this user
        element.innerHTML = `
        <div class="message-container">
            <div id="message${message.senderId == sessionUser.id ? "From" : "To"}" class="message">
                <p>${message.content}</p>
                <p class="text-xs">${message.time}</p>
            </div>
        </div>
        `
        messages.push(element);
    })

    //render the messages
    messagesView.replaceChildren(...messages);
    
}

function sendMessage(chatId) {
    const text = document.getElementById("chatInput").value;
    const alert = new Alert();
    if (!text.length) {
        alert.show("error", "Cannot send empty message");
    }
    const message = new Message(chatId, sessionUser.id, text);
    const chat = chatStore.getAll().find(c => c.id == chatId);

    chat.messages.push(message);
    renderMessages(chat,true,message);
    document.getElementById("chatInput").value = "";
}


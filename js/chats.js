import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat, Message } from "./models/Chat.js";


//global variables/elements
const chatList = document.getElementById("chatList");
const searchInput = document.getElementById("searchInput");
const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const messagesView = document.getElementById("messagesView");
const chatIdElement = document.createElement("input");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));
const chatStore = new Store("chats");
const userStore = new Store("users");


//event listeners
window.addEventListener("load", () => {
    //display the chats first
    displayChats()
    //check if there is a "c" searchParam
    const chatId = new URL(location.href).searchParams.get("c");

    //if not empty, select that chat
    if (chatId) {
        showSelectedChat(chatId);
    }
    
});
searchInput.addEventListener("change", (e) => getUsers(searchInput.value));
//listen for events on localstorage chats key
window.addEventListener("storage", (e) => {
    if (e.key == "chats") {
        displayChats();
        const affectedChat = JSON.parse(e.newValue).at(-1);
        const chatId = chatIdElement.value;
        //if it is the currently opened chat, update the messagesView
        if (affectedChat.id == chatId) {
            renderMessages(null, true, affectedChat.messages.at(-1));
        }
    }
})






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
            `<div id='${user.username}' class='chat-list-item ${chatIdElement.value == chat.id ? "bg-background": ""}'>
                <img class='avatar' src='../assets/images/avatar.jpg'/>
                <span>
                    <p>${user.firstName} ${user.surname} ${sessionUser.id == user.id ? "(You)":""}</p>
                    <p class='text-grey text-xs'>
                        ${chat.messages.at(-1)?.senderId == sessionUser.id ? "You" : user.firstName}:
                        ${chat.messages.at(-1)?.content ?? ""}
                    </p>
                    <p class='text-grey text-xs'>${chat.messages.at(-1)?.time ?? ""}</p>
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
    //save to the chatIdElement that is not yet on the page
    chatIdElement.value = chatId;

    //get the chat
    const chat = chatStore.getAll().find(c => c.id == chatId);
    if (chat) {
        const userId = chat.users.find(id => id != sessionUser.id);
        const user = userStore.getAll().find(u => u.id == userId);
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

        displayChats();
        renderMessages(chat);
        
    }
    else {
        const alert = new Alert();
        alert.show("error", "This chat is inaccessible, it might have been deleted, or it never existed");
    }
}

function renderMessages(chat, append = false, message = null) {

    /**
     * Renders messages on the DOM
     * if append is true, message must be an object, it will append message into the dom instead of replacing all elements
     * chat is optional if append is true, can be set to null
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
        //scroll down
        messagesView.scrollTop = messagesView.scrollHeight;
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
    messagesView.scrollTop = messagesView.scrollHeight;
    
}

function sendMessage(chatId) {
    const text = document.getElementById("chatInput").value;
    const alert = new Alert();
    if (!text.length) {
        alert.show("error", "Cannot send empty message");
    }
    const message = new Message(chatId, sessionUser.id, text);
    //get the chats
    const chats = chatStore.getAll();
    const chat = chats.find(c => c.id == chatId);
    //push new message
    chat.messages.push(message);
    localStorage.setItem("chats", JSON.stringify(chats));
    //render message
    renderMessages(chat, true, message);
    displayChats();
    document.getElementById("chatInput").value = "";
}


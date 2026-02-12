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
const isGroupsChat = location.href.includes("groups.html");
const onlineUsers = new Store("online").getAll();

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

    const chats = chatStore.getAll();
    const chatId = chatIdElement.value;
    const currentChat = chats.find(chat => chat.id == chatId);

    if (e.key == "chats") {
        displayChats();
        if (currentChat) {
            renderMessages(currentChat);
        }
    }
})


function displayChats() {

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
        
        if (!isGroupsChat && chat.type != "group") {
            //private chats
            //other user in the chat
            const userId = chat.users.find(id => id != sessionUser.id);
            const user = userStore.getAll().find(u => u.id == userId);

            

            item.addEventListener("click", () => showSelectedChat(chat.id))
            item.innerHTML =
                `<div id='div-${user.username}' class='chat-list-item ${chatIdElement.value == chat.id ? "bg-background": ""}'>
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
        }
        else if(isGroupsChat && chat.type == "group"){
            //group chats
            //other users in the chat
            item.addEventListener("click", () => showSelectedChat(chat.id))
            item.innerHTML =
                `<div id='${chat.name}' class='chat-list-item ${chatIdElement.value == chat.id ? "bg-background": ""}'>
                    <img class='avatar' src='../assets/images/avatar.jpg'/>
                    <span>
                        <p>${chat.name}</p>
                        <p class='text-grey text-xs'>
                            ${chat.messages.at(-1)?.content ?? ""}
                        </p>
                        <p class='text-grey text-xs'>${chat.messages.at(-1)?.time ?? ""}</p>
                    </span>
                </div>`
        }
            
        list.appendChild(item);
    })
    //append the list to the parent node
    chatList.replaceChildren(list);

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

// create a private chat
function initiateChat(userId) {
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
        //get the other user
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
                <p>${chat.type == "group" ? chat.name : user.firstName + " " + user.surname}</p>
                ${chat.type == "group" ? `<p class="text-xs">${chat.users.length} members</p>` :
                onlineUsers.includes(userId) ? `<p id="onlineStatus" class='text-success text-xs'>online</p>` : `<p id="onlineStatus" class='text-error text-xs'>offline</p>` }
            </span>   
        `
        //display the chat input container
        document.getElementById("chatInputContainer").style.display = "flex";
        //insert its contents
        document.getElementById("chatInputContainer").innerHTML = `
            <textarea type="text" name="chatInput" id="chatInput" class="w-full"></textarea>
            <button class="bg-primary" onclick="sendMessage('${chat.id}')">Send</button>
        `

        displayChats();
        renderMessages(chat);

        //event listener for the onlineStatus, only updates the onlineStatus element
        window.addEventListener("storage", (e) => {
            if (e.key == "online") {
                const onlineUsers = new Store("online").getAll();
                const onlineStatusEl = document.getElementById("onlineStatus");
                //update the online status in the current chat if the user affected is in this chat
                if (onlineUsers.includes(userId)) {
                    onlineStatusEl.innerHTML = "online";
                    onlineStatusEl.classList.remove("text-error")
                    onlineStatusEl.classList.add("text-success");
                }
                else {
                    onlineStatusEl.innerHTML = "offline";
                    onlineStatusEl.classList.add("text-error")
                    onlineStatusEl.classList.remove("text-success");
                }
            }
        })
        
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
    
    //check if there are any messages in the chat
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
                ${chat.type == "group" && message.senderId != sessionUser.id  ?"<p class='text-primary'>"+userStore.getAll().find(u => u.id == message.senderId).username+"</p>" : "" }
                <p>${message.content}</p>
                <p class="text-xs">${message.time}</p>
            </div>
        </div>
        `
        messages.push(element);
    })

    //render the messages
    messagesView.replaceChildren(...messages);
    //scroll down
    messagesView.scrollTop = messagesView.scrollHeight;
    
}


function sendMessage(chatId) {
    /**
     * Reads the chatInput element, creates a message object, and stores in localstorage
     */
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


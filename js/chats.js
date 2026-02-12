import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat, Message } from "./models/Chat.js";
import { getImageUrl, uploadImage } from "./utils/images.js";
import { PrivateChats } from "./templates/PrivateChats.js";
import GroupChats from "./templates/GroupChats.js";
import ChatHeader from "./templates/ChatHeader.js";
import MessageComponent from "./templates/MessageComponent.js";
import { sortChats } from "./utils/chatUtils.js";
import { initiateChat, toggleView } from "./people.js";


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
const typingStore = new Store("typing");

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
searchInput.addEventListener("change", (e) => displayChats(searchInput.value));
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

 const displayChats = (value = "") => {
    //get chats that this user is in
     let chats = chatStore.getAll().filter(c => c.users.includes(sessionUser.id));
     if (!chats.length) {
        const message = document.createElement("p");
        message.innerText = "No chats yet.";
        chatList.appendChild(message);
        return;
    }
     //if the search value is not empty
     if (value) {
         value = value.trim().toLowerCase();
         chats = chats.filter(chat => {
             if (chat.type == "group") {
                 return chat.name.toLowerCase().includes(value);
             }

             return chat.messages?.at(-1)?.content?.toLowerCase().includes(value);
         })
     }
     
     const list = document.createElement("ul");
     //sort by time
     sortChats(chats);

    chats.forEach(async(chat) => {
        //create an element for each chat
        const item = document.createElement("li");
        
        if (!isGroupsChat && chat.type != "group") {
            //private chats
            //other user in the chat
            const userId = chat.users.find(id => id != sessionUser.id);
            const user = userStore.getAll().find(u => u.id == userId);
            item.addEventListener("click", () => showSelectedChat(chat.id))
            item.innerHTML = await PrivateChats({ user, chat, chatIdElement, sessionUser, getImageUrl });
        }
        else if(isGroupsChat && chat.type == "group"){
            //group chats
            item.addEventListener("click", () => showSelectedChat(chat.id))
            item.innerHTML = await GroupChats({chat, getImageUrl,chatIdElement})
        }
        list.appendChild(item);
    })
     
    //append the list to the parent node
    chatList.replaceChildren(list);

}




const showSelectedChat = async(chatId) => {
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
        document.getElementById("chatHeader").innerHTML = await ChatHeader({ chat, getImageUrl, user, onlineUsers, userId });

        document.getElementById("profileImage").addEventListener("click", (e) => {
            if (chat.type != "group") {
                return;
            }
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.click();
            fileInput.onchange = async(e) => {
                if (fileInput.files) {
                    //upload the image to indexedDB
                    await uploadImage(fileInput.files[0], chat.id)
                }
            }
        })
        //display the chat input container
        document.getElementById("chatInputContainer").style.display = "flex";
        //insert its contents
        document.getElementById("chatInputContainer").innerHTML = `
            <textarea type="text" name="chatInput" id="chatInput" class="w-full"></textarea>
            <button class="bg-primary" onclick="sendMessage('${chat.id}')">Send</button>
        `
        document.getElementById("chatInput").addEventListener("keydown", (e) => {

            if (window.innerWidth > 700) {
                if (!e.shiftKey && e.key.toLowerCase() == "enter") {
                    sendMessage(chatId);
                }
            }
            //current chat
            if (!typingStore.getAll().some(t => t.chatId == chatId && t.userId == sessionUser.id)) {
                typingStore.insert({ chatId, userId: sessionUser.id });
            }
        })
        
        document.getElementById("chatInput").addEventListener("change", () => {
            //current chat
            typingStore.remove((t) => t.chatId == chatId && t.userId == sessionUser.id);
        })
        displayChats();
        renderMessages(chat);

        //event listener for the onlineStatus, only updates the onlineStatus element
        window.addEventListener("storage", (e) => {
            const onlineStatusEl = document.getElementById("onlineStatus");
            if (e.key == "online") {
                const onlineUsers = new Store("online").getAll();
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
            else if (e.key == "typing") {
                const typingUsers = new Store("typing").getAll();
                const thisChat = typingUsers.find(u => u.chatId == chatId);
                if (thisChat && thisChat.userId == user.id) {
                    onlineStatusEl.innerHTML = "typing...";
                    onlineStatusEl.classList.remove("text-error")
                    onlineStatusEl.classList.add("text-success");
                }
                else {
                    onlineStatusEl.innerHTML = "online";
                    onlineStatusEl.classList.remove("text-error")
                    onlineStatusEl.classList.add("text-success");
                }
            }
        })
    }
    else {
        const alert = new Alert();
        alert.show("error", "This chat is inaccessible, it might have been deleted, or it never existed");
    }
}

const renderMessages = (chat, append = false, message = null) => {
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
        element.innerHTML = MessageComponent({ message, sessionUser });
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
        element.innerHTML = MessageComponent({ message, sessionUser });
        messages.push(element);
    })
    //render the messages
    messagesView.replaceChildren(...messages);
    //scroll down
    messagesView.scrollTop = messagesView.scrollHeight;
}

const sendMessage = (chatId) => {
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

//link to the window
window.initiateChat = initiateChat;
window.toggleView = toggleView;
window.sendMessage = sendMessage;
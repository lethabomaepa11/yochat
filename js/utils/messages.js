import { Message } from "../models/Chat.js";
import { Alert } from "./alert.js";

export const sendMessage = (chatId, renderMessages, sessionUser) => {
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
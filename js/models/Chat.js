export class Chat{
    constructor(users) {
        //users is an array of the ids of the users in a chat
        this.id = Date.now() + "-" + Math.floor(Math.random() * Date.now());
        this.users = users;
        this.messages = [];
    }
}
export class Message{
    constructor(chatId, senderId, content) {
        this.id = Date.now() + "-" + Math.floor(Math.random() * Date.now());
        this.chatId = chatId;
        this.senderId = senderId;
        this.content = content;
        this.time = new Date().toLocaleTimeString();
        this.status = "sent";
    }
}
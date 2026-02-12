export class Chat{
    constructor(users, type = "private", name = "") {
        //users is an array of the ids of the users in a chat
        this.id = crypto.randomUUID();
        this.users = users;
        this.messages = [];
        this.type = type;//group chat or private
        this.name = name;//used in group chats
    }
}
export class Message{
    constructor(chatId, senderId, content) {
        this.id = crypto.randomUUID();
        this.chatId = chatId;
        this.senderId = senderId;
        this.content = content;
        this.time = new Date().toLocaleTimeString();
        this.status = "sent";
    }
}
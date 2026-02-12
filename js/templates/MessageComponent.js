export default ({ message, sessionUser })  => {
    const date = new Date(message.time);
    return `
        <div class="message-container">
            <div id="message${message.senderId == sessionUser.id ? "From" : "To"}" class="message">
                <p>${message.content}</p>
                <p class="text-xs">${date.toLocaleString()}</p>
            </div>
        </div>
        `
}
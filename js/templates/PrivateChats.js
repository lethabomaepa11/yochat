export async function PrivateChats({user, chat, chatIdElement, sessionUser, getImageUrl}) {
    return `<div id='div-${user.username}' class='chat-list-item ${chatIdElement.value == chat.id ? "bg-background": ""}'>
                <img class='avatar' src='${await getImageUrl(user.id)}'/>
                <span>
                    <p>${user.firstName} ${user.surname} ${sessionUser.id == user.id ? "(You)":""}</p>
                    <p class='text-grey text-xs'>
                        ${chat.messages.at(-1)?.senderId == sessionUser.id ? "You" : user.firstName}:
                        ${chat.messages.at(-1)?.content ?? ""}
                    </p>
                    <p class='text-grey text-xs'>${new Date(chat.messages.at(-1)?.time ?? 0).toLocaleString()}</p>
                </span>
            </div>`
}
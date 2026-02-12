export default async({chat, getImageUrl,chatIdElement}) => {
    return `<div id='${chat.name}' class='chat-list-item ${chatIdElement.value == chat.id ? "bg-background": ""}'>
                <img class='avatar' src='${await getImageUrl(chat.id)}'/>
                <span>
                    <p>${chat.name}</p>
                    <p class='text-grey text-xs'>
                        ${chat.messages.at(-1)?.content ?? ""}
                    </p>
                    <p class='text-grey text-xs'>${new Date(chat.messages.at(-1)?.time ?? 0).toLocaleString()}</p>
                </span>
            </div>`
}
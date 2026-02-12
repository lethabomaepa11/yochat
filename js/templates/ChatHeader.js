export default async({chat,getImageUrl,user,onlineUsers, userId }) => {
    return `
            <a href="./${chat.type == "group" ? "groups" :"chat"}.html" style="color: white"><i class="fa fa-arrow-left"></i></a>
            <img  id='profileImage' class='avatar' src='${await getImageUrl(chat.type == "group" ? chat.id : user.id)}' />
            <span>
                <p>${chat.type == "group" ? chat.name : user.firstName + " " + user.surname}</p>
                ${chat.type == "group" ? `<p class="text-xs">${chat.users.length} members</p>` :
                onlineUsers.includes(userId) ? `<p id="onlineStatus" class='text-success text-xs'>online</p>` : `<p id="onlineStatus" class='text-error text-xs'>offline</p>` }
            </span>   
        `
}
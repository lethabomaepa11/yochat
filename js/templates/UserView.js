export default async function ({user,getImageUrl,mutualGroups,isOnline}) {
    return `
            <div class="${window.innerWidth > 700 ? "card" : ""} card-sm flex flex-col items-center justify-center">
            ${window.innerWidth < 700 ?
                `<span class="flex items-center w-full" style="margin: 5px">
                    <a href="./people.html" style="color: white"><i class="fa fa-arrow-left"></i></a>
                    <h3>${user.firstName} ${user.surname}</h3>
                </span>` : ""}
                <p class="text-xs text-grey" style="margin: 0;">@${user.username}</p>
                <img src="${await getImageUrl(user.id)}" alt="${user.username}" class="avatar" style="width: 100px;height: 100px;"/>
                <p>${user.firstName} ${user.surname}</p>
                <p id="onlineStatus" class="${isOnline ? "text-success" : "text-error"} text-xs"><b>${isOnline ? "online" : "offline"}</b></p>
                <div>
                    <p>Mutual Groups:</p>
                    <p id="mutualGroups" class="text-xs">
                        ${!mutualGroups.length ? "None" : ""}
                        ${mutualGroups.map(group => {
                            return `<a href="./groups.html?c=${group.id}">
                                ${group.name} (${group.users.length} members)
                             </a>
                            `
                        })}
                    </p>
                </div>
                <button class="bg-primary w-full" ${window.innerWidth < 700 && `style="position: fixed;bottom: 5px;"`} onclick="initiateChat('${user.id}')">Say Hi!</button>
            </div>
        `
}
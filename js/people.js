import {Store} from "./utils/store.js"


//global variables/elements
const peopleList = document.getElementById("peopleList");
const searchInput = document.getElementById("searchInput");

//event listeners
document.addEventListener("load", getUsers());
searchInput.addEventListener("change", (e) => getUsers(searchInput.value));


function getUsers(key = "*") {
    const userStore = new Store("users");
    let result = [];
    if (key == "*" || key.toLowerCase() == "all") {
        //show all
        result = userStore.getAll();
    }
    else {
        key = key.toLowerCase().trim();
        result = userStore.getAll().filter(user => user.username.toLowerCase().includes(key) || user.firstName.toLowerCase().includes(key) || user.surname.toLowerCase().includes(key));
    }
    //filter by key

    displayUsers(result)
}
function displayUsers(users = []) {
    peopleList.replaceChildren();//clearing items

    //if no users are found
    if (!users.length) {
        const message = document.createElement("p");
        message.innerText = "No users found.";
        peopleList.appendChild(message);
        return;
    }

    //display the users
    const list = document.createElement("ul");
    users.forEach(user => {
        const item = document.createElement("li");
        item.innerHTML =
            `<div id='${user.username}' class='chat-list-item'>
                <img class='avatar' src='../assets/images/avatar.jpg'/>
                <span>
                    <p>${user.firstName} ${user.surname}</p>
                    <p class='text-success text-xs'>Online</p>
                </span>
            </div>`
        list.appendChild(item);
    })
    //append the list to the parent node
    peopleList.appendChild(list);

}
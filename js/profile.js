import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { Chat } from "./models/Chat.js";
import { isUniqueUsername } from "./signup.js";
import { getImageUrl, uploadImage } from "./utils/images.js";



const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));

//event listeners
document.addEventListener("load", showUserProfile());

function displayView() {
    if (window.innerWidth > 700) {
        //desktop, just skip this method
        return;
    }
    //middleView is currently active
    middleView.style.display = "none";
    mainView.style.display = "block";
}

async function showUserProfile() {
    const userStore = new Store("users");
    const user = userStore.getAll().find(usr => usr.id == sessionUser.id);

    const formTemplate = `<form id="profileForm" class="w-full" name="profileForm">
                <!-- Displayed: inline on Desktop, Block on mobile -->
                <span class="form-field flex sm-flex-col w-full" style="gap:10px;">
                    <span class="form-field">
                        <label for="firstName">First Name</label>
                        <input type="text" name="firstName" id="firstName" required value="${user.firstName}"/>
                    </span>
                    <span class="form-field">
                        <label for="surname">Surname</label>
                        <input type="text" name="surname" id="surname" required value="${user.surname}"/>
                    </span>
                </span>
                <span class="form-field">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" required value="${user.username}"/>
                </span>
                <button class="bg-primary">Update</button>
            </form>`
    
    
    if (user) {
        //on mobile
        displayView();
        //show the person on the main view
        mainView.classList.add("flex", "flex-col", "items-center", "justify-center");
        mainView.innerHTML = `
            <div class="${window.innerWidth > 700 ? "card" : ""} card-sm flex flex-col items-center justify-center">
                ${window.innerWidth < 700 ?
                `<span class="flex items-center w-full" style="justify-content: space-between;margin: 5px">
                    <h1>My Profile</h1>
                    <button class="chat-list-item logoutBtn" style="color: red;padding: 10px;width: max-content">Logout</button>
                </span>` : ""}
                <p class="text-xs text-grey" style="margin: 0;">@${user.username}</p>
                <img onclick="upload" src="${await getImageUrl(user.id)}" alt="${user.username}" class="avatar" style="width: 100px;height: 100px;"/>
                <button title="Upload new Image" id="fileInputBtn" class="bg-background" style="color: white">
                    <i class="fa fa-upload" style="padding: 0"></i>
                </button>
                <p>${user.firstName} ${user.surname}</p>
                <p class="text-success text-xs"><b>Online</b></p>
                ${formTemplate}
            </div>
        `
        const logoutBtns = document.getElementsByClassName("logoutBtn");
        for (let i = 0; i < logoutBtns.length; i++) {
            logoutBtns[i].addEventListener("click", handleLogout);
        }
        function handleLogout(){
            if (sessionUser) {
                sessionStorage.clear();
            }
            location.reload();
        }

        document.getElementById("fileInputBtn").addEventListener("click",(e) => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";

            fileInput.click();

            fileInput.onchange = async(e) => {
                if (fileInput.files) {
                    //upload the image to indexedDB
                    await uploadImage(fileInput.files[0], sessionUser.id)
                }
            }
        })
        document.getElementById("profileForm").addEventListener("submit", (e) => handleSubmit(e));
        const usernameInput = document.getElementById("username");
        usernameInput.addEventListener("change", () => {
            const alert = new Alert();
            if (isUniqueUsername(usernameInput.value, user.id)) {
                alert.show("success", "Username is available");
                
            }
            else {
                alert.show("error", "Username already exists");
            }
        });
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }

    

}
function handleSubmit(e) {
    e.preventDefault();
    const alert = new Alert();
    const username = document.getElementById("username").value;
    if (!isUniqueUsername(username, sessionUser.id)) {
        alert.show("error", "Username is already taken");
        return;
    }

    const users = new Store("users").getAll();
    const user = users.find(u => u.id == sessionUser.id);
    user.firstName = document.getElementById("firstName").value;
    if (!user.firstName.length) {
        alert.show("error", "First name cannot be blank");
        return;
    }
    user.surname = document.getElementById("surname").value;
    if (!user.surname.length) {
        alert.show("error", "Surname cannot be blank");
        return;
    }
    user.username = username;

    localStorage.setItem("users", JSON.stringify(users));
    alert.show("success", "Profile updated successfully");
    location.reload();
    
}
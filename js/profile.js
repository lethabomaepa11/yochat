import { Store } from "./utils/store.js"
import { Alert } from "./utils/alert.js"
import { isUniqueUsername } from "./signup.js";
import { getImageUrl, uploadImage } from "./utils/images.js";
import ProfileForm from "./templates/ProfileForm.js";



const middleView = document.getElementById("middleView");
const mainView = document.getElementById("mainView");
const sessionUser = JSON.parse(sessionStorage.getItem("session"));



const displayView = () => {
    if (window.innerWidth > 700) {
        //desktop, just skip this method
        return;
    }
    //middleView is currently active
    middleView.style.display = "none";
    mainView.style.display = "block";
}
const handleLogout = () => {
            if (sessionUser) {
                sessionStorage.clear();
            }
            location.reload();
}

const showUserProfile = async() => {
    const userStore = new Store("users");
    const user = userStore.getAll().find(usr => usr.id == sessionUser.id);    
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
                ${ProfileForm({ user })}
            </div>
        `
        setEventListeners();
    }
    else {
        const alert = new Alert();
        alert.show("error", "An error has occured, please reload page and try again");
    }  
}

const handleSubmit = (e) => {
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

//event listeners
document.addEventListener("load", showUserProfile());


const setEventListeners = () => {
    //profile form submission
    document.getElementById("profileForm").addEventListener("submit", (e) => handleSubmit(e));

    //username on change
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
    //fileInputBtn onclick
    document.getElementById("fileInputBtn").addEventListener("click",(e) => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            fileInput.click();

            fileInput.onchange = async(e) => {
                if (fileInput.files) {
                    //upload the image to indexedDB
                    await uploadImage(fileInput.files[0], sessionUser.id)
                }
            }
    })
    const logoutBtns = document.getElementsByClassName("logoutBtn");
        for (let i = 0; i < logoutBtns.length; i++) {
            logoutBtns[i].addEventListener("click", handleLogout);
        }
}

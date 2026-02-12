import { OnlineStatus } from "./js/utils/statuses.js";
import { Store } from "./js/utils/store.js";

//check the current page the user is in and if unauthenticated, redirect them to login
const publicPages = ["index.html", "login.html", "signup.html"];
const user = sessionStorage.getItem("session");

const pathname = location.pathname;
//get the file/page
const currentPage = pathname.substring(pathname.lastIndexOf("/")+1).toLowerCase();
//if(!user &&  )
if (!user && !publicPages.includes(currentPage)) {
    location.href = "./login.html"
}

//maintain online status
const onlineStatus = new OnlineStatus();
window.addEventListener("load", onlineStatus.set);
window.addEventListener("unload", () => {
    onlineStatus.remove()
});
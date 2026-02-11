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

function renderNav() {
    /**
     * TODO
     * Renders navigation as sidebar for desktop or bottom nav for mobile
     * It will also check the active page and show.
     * 
     */
    if (window.innerWidth < 700) {
        //render the bottom nav
    } else {
        //render the sidebar
    }
}
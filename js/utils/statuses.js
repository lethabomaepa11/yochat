import { Store } from "./store.js";


export class OnlineStatus{

    _sessionUser = JSON.parse(sessionStorage.getItem("session") ?? "{}");
        //store id's of online users
    _onlineStore = new Store("online");
    constructor() {
        this.set();
    }
    
    set() {
        //add the current user to localstorage online users.
        if (this._sessionUser?.id) {
            //avoid duplicates
            this.remove();
            this._onlineStore.insert(this._sessionUser.id);
        }
    }
    remove() {
        //remove the current user's id from online statuses
        if (this._sessionUser?.id) {
            this._onlineStore.remove(this._sessionUser.id);
        }
    }
    active(id) {
        //returns true if a user is online
        return this._onlineStore.getAll().includes(id);  
    }
}


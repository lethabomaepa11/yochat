import { Alert } from "./alert.js";

export async function uploadImage(file, userId) {
        const db = await openDB();
        db.transaction("images", "readwrite")
        .objectStore("images")
        .put(file, userId);
    
    new Alert().show("success","Image Uploaded successfully")
    location.reload();
}
export async function getImageUrl(userId){
    const blob = await getImage(userId);
    if (blob) {
        return URL.createObjectURL(blob);
    }
    else {
        //default
        return "../assets/images/avatar.jpg"
    }
}
 async function getImage(userId){
    const db = await openDB();

    return new Promise(resolve => {
        const req = db
        .transaction("images")
        .objectStore("images")
        .get(userId);

        req.onsuccess = () => resolve(req.result);
    });
}


async function openDB() {
   return new Promise((resolve, reject) => {
		const request = indexedDB.open("YoChat!", 1);
		request.onerror = (event) => {
			reject(event.target.error);
		};
		request.onsuccess = (event) => {
			resolve(event.target.result);
		};
		request.onupgradeneeded = (event) => {
            const objectStore = event.target.result.createObjectStore("images");
		};
	});
}


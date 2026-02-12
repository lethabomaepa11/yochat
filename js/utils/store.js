

export class Store{
    constructor(key) {
        /**
         * Gets the key to name the storage object
         * The key will be used in all functions here
         * @param {string} - key
        */
        
        if (!key.length) {
            throw Error("Key is required for Store instance");
        }
        
        this._key = key;
    }

    
    insert(value) {
        // Inserts new data without overwriting the existing data in localstorage
        try {
            const data = this.getAll();
            data.push(value);
            localStorage.setItem(this._key, JSON.stringify(data));
        } catch (e) {
            throw Error(e.message);
        }
    }

    getAll() {
        /**
         * Returns the array of all items of a particular localStorage item.
         * @returns {Array}
         */
        const raw = localStorage.getItem(this._key);
        if (raw) {
            return JSON.parse(localStorage.getItem(this._key));
        }
        return [];
    }
    remove(value) {
        const data = this.getAll();

        let filtered;

        if (typeof value === "function") {
            //for object arrays
            //filter by values that return true for the condition/function given
            filtered = data.filter(item => !value(item));
        } else {
            //direct comparison for non-object arrays
            filtered = data.filter(item => item !== value);
        }

        localStorage.setItem(this._key, JSON.stringify(filtered));
    }

    set(data) {
        localStorage.setItem(this._key, JSON.stringify(data));
    }



}




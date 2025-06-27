function unproxify(prox) {
    return JSON.parse(JSON.stringify(prox));
}
export default function initDataBase(storeName) {
    console.log(storeName);
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ZubWare");
        let db;
        function upgradeNeeded(ev) {
            const db = this.result;
            if (!db.objectStoreNames.contains(storeName)) {
                console.log("store created", storeName);
                const store = db.createObjectStore(storeName, {
                    keyPath: "id",
                });
                store.createIndex("type", "type");
            }
        }
        request.onupgradeneeded = upgradeNeeded;
        request.onerror = (ev) => reject(ev.target);
        request.onsuccess = function () {
            db = this.result;
            console.log("success", db.objectStoreNames);
            if (!db.objectStoreNames.contains(storeName)) {
                db.close();
                const upgradeRequest = indexedDB.open("ZubWare", db.version + 1);
                upgradeRequest.onupgradeneeded = upgradeNeeded;
                upgradeRequest.onsuccess = () => createHandlers(this.result, storeName);
                return;
            }
            resolve(createHandlers(db, storeName));
        };
    });
}
function createHandlers(db, storeName) {
    function storeItem(item) {
        return new Promise((resolve) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(unproxify(item)); // Overwrites existing item with same uid
            request.onsuccess = () => resolve();
            request.onerror = (event) => console.error("Update error:", event.target);
        });
    }
    function removeItem(id) {
        return new Promise((resolve) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            console.log(id);
            const request = store.delete(id);
            request.onsuccess = () => resolve(id);
            request.onerror = (event) => console.error("Deletion error:", event.target);
        });
    }
    function getItem(id) {
        return new Promise((resolve) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => console.error("Deletion error:", event.target);
        });
    }
    function getKeys() {
        return new Promise((resolve) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                let res = request.result.map(({ id, type }) => ({
                    id,
                    type,
                }));
                resolve(res);
            };
            request.onerror = (event) => console.error("GetKeys error:", event.target);
        });
    }
    function getAll() {
        return new Promise((resolve) => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => console.error("GetKeys error:", event.target);
        });
    }
    return { storeItem, removeItem, getItem, getKeys, getAll };
}

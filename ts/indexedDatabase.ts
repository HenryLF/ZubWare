interface DBObject {
  id: string;
  type: string;
}

function unproxify(prox: object) {
  return JSON.parse(JSON.stringify(prox));
}
export default function initDataBase(storeName: string) {
  console.log(`Oppenning local DB store ${storeName}.`);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ZubWare");
    let db: IDBDatabase;

    function upgradeNeeded(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) {
      const db = this.result;
      if (!db.objectStoreNames.contains(storeName)) {
        console.log(`New store created : ${storeName}.`);
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
      console.log(`Indexed DB sucessfully openned.`);
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

function createHandlers(db: IDBDatabase, storeName: string) {
  function storeItem(item: DBObject) {
    return new Promise<void>((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.put(unproxify(item)); // Overwrites existing item with same uid

      request.onsuccess = () => resolve();
      request.onerror = (event) =>
        console.error(`Indexed DB update error ${storeName}: `, event.target);
    });
  }

  function removeItem(id: string) {
    return new Promise<string>((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(id);
      request.onerror = (event) =>
        console.error(`Indexed DB delete error ${storeName}: `, event.target);
    });
  }

  function getItem(id: string) {
    return new Promise<DBObject>((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        console.error(`Indexed DB get error ${storeName}: `, event.target);
    });
  }

  function getKeys() {
    return new Promise<{ id: IDBValidKey; type: string }[]>((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => {
        let res = request.result.map(({ id, type }: DBObject) => ({
          id,
          type,
        }));
        resolve(res);
      };
      request.onerror = (event) =>
        console.error(`Indexed DB getKeys error ${storeName}: `, event.target);
    });
  }

  function getAll() {
    return new Promise<DBObject[]>((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) =>
        console.error(`Indexed DB getAll error ${storeName}: `, event.target);
    });
  }

  return { storeItem, removeItem, getItem, getKeys, getAll };
}

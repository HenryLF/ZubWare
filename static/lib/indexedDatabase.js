(function(g,f){if(typeof define=="function"&&define.amd){define(f)}else if(typeof exports=="object" && typeof module<"u"){module.exports=f()}else{var m=f();for(var i in m) g[i]=m[i]}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ts/indexedDatabase.ts
var indexedDatabase_exports = {};
__export(indexedDatabase_exports, {
  initDataBase: () => initDataBase
});
module.exports = __toCommonJS(indexedDatabase_exports);
function unproxify(prox) {
  return JSON.parse(JSON.stringify(prox));
}
function initDataBase(storeName) {
  console.log(`Oppenning local DB store ${storeName}.`);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ZubWare");
    let db;
    function upgradeNeeded(ev) {
      const db2 = this.result;
      if (!db2.objectStoreNames.contains(storeName)) {
        console.log(`New store created : ${storeName}.`);
        const store = db2.createObjectStore(storeName, {
          keyPath: "id"
        });
        store.createIndex("type", "type");
      }
    }
    request.onupgradeneeded = upgradeNeeded;
    request.onerror = (ev) => reject(ev.target);
    request.onsuccess = function() {
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
function createHandlers(db, storeName) {
  function storeItem(item) {
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(unproxify(item));
      request.onsuccess = () => resolve();
      request.onerror = (event) => console.error(`Indexed DB update error ${storeName}: `, event.target);
    });
  }
  function removeItem(id) {
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve(id);
      request.onerror = (event) => console.error(`Indexed DB delete error ${storeName}: `, event.target);
    });
  }
  function getItem(id) {
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => console.error(`Indexed DB get error ${storeName}: `, event.target);
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
          type
        }));
        resolve(res);
      };
      request.onerror = (event) => console.error(`Indexed DB getKeys error ${storeName}: `, event.target);
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
      request.onerror = (event) => console.error(`Indexed DB getAll error ${storeName}: `, event.target);
    });
  }
  return { storeItem, removeItem, getItem, getKeys, getAll };
}

if(__exports != exports)module.exports = exports;return module.exports}));

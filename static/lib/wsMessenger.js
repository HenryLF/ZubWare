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

// ts/wsMessenger.ts
var wsMessenger_exports = {};
__export(wsMessenger_exports, {
  initClient: () => initClient
});
module.exports = __toCommonJS(wsMessenger_exports);
function initClient() {
  return new Promise(
    (resolve, reject) => {
      const ws = new WebSocket(`ws://${window.location.host}/wschat`);
      let clientData;
      function sendMsg(author, content) {
        if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING) return;
        console.log(author, content);
        clientData.name = author;
        ws.send(
          JSON.stringify({
            type: 2 /* MsgOutgoing */,
            detail: {
              id: clientData.id,
              author,
              content,
              date: new Date(Date.now()).toString()
            }
          })
        );
      }
      function messageHandler(ev) {
        const { type, detail } = JSON.parse(ev.data);
        let event;
        console.log("server msg received", type, detail);
        switch (type) {
          case 0 /* ConnClose */:
            event = new CustomEvent("ws-conn-close", { detail });
            break;
          case 1 /* ConnOpen */:
            clientData = detail;
            ws.send(JSON.stringify({ type: 1 /* Listening */ }));
            event = new CustomEvent("ws-conn-open", { detail });
            break;
          case 2 /* MsgIncoming */:
            event = new CustomEvent("ws-message", { detail });
            break;
          case 3 /* HubInfo */:
            event = new CustomEvent("ws-lobbyinfo", { detail });
        }
        event && window.dispatchEvent(event);
      }
      ws.onopen = function() {
        ws.onmessage = messageHandler;
        resolve(sendMsg);
      };
      ws.onerror = function(ev) {
        reject(ev);
      };
    }
  );
}

if(__exports != exports)module.exports = exports;return module.exports}));

(function(g,f){if(typeof define=="function"&&define.amd){define(f)}else if(typeof exports=="object" && typeof module<"u"){module.exports=f()}else{var m=f();for(var i in m) g[i]=m[i]}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};

// ts/wsGameRPS.ts
var wsClient;
window.initClient = function() {
  return new Promise((resolve) => {
    wsClient = new WebSocket(`ws://${window.location.host}/wsrps`);
    function sendPlay(k) {
      console.log("hey", wsClient);
      wsClient == null ? void 0 : wsClient.send(
        JSON.stringify({
          type: 4 /* Play */,
          detail: k
        })
      );
    }
    function sendRegistration(name) {
      wsClient == null ? void 0 : wsClient.send(
        JSON.stringify({
          type: 3 /* Registering */,
          detail: name
        })
      );
    }
    function sendExit(replay) {
      wsClient == null ? void 0 : wsClient.send(
        JSON.stringify({
          type: 5 /* Quit */,
          detail: replay
        })
      );
    }
    wsClient.onopen = function() {
      console.log("WS Connection oppened.");
      wsClient.onmessage = messageHandle;
      wsClient.onclose = () => dispatchEvent(new CustomEvent("ws-conn-close"));
      resolve({ sendPlay, sendRegistration, sendExit });
    };
    wsClient.onerror = console.error;
  });
};
function messageHandle(ev) {
  const { type, detail } = JSON.parse(ev.data);
  let event;
  console.log("server msg received", type, detail);
  switch (type) {
    case 0 /* ConnClose */:
      event = new CustomEvent("ws-conn-close", { detail });
      break;
    case 1 /* ConnOpen */:
      event = new CustomEvent("ws-conn-open", { detail });
      break;
    case 4 /* EnterPool */:
      event = new CustomEvent("ws-enter-pool", { detail });
      break;
    case 5 /* EnterLobby */:
      event = new CustomEvent("ws-enter-lobby", { detail });
      break;
    case 6 /* LobbyInfo */:
      event = new CustomEvent("ws-lobby-info", { detail });
      break;
    case 7 /* GameResult */:
      event = new CustomEvent("ws-game-end", { detail });
      break;
  }
  event && window.dispatchEvent(event);
}

if(__exports != exports)module.exports = exports;return module.exports}));

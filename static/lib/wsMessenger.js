"use strict";
var ServerCode;
(function (ServerCode) {
    ServerCode[ServerCode["ConnClose"] = 0] = "ConnClose";
    ServerCode[ServerCode["ConnOpen"] = 1] = "ConnOpen";
    ServerCode[ServerCode["MsgIncoming"] = 2] = "MsgIncoming";
    ServerCode[ServerCode["LobbyInfo"] = 3] = "LobbyInfo";
})(ServerCode || (ServerCode = {}));
var ClientCode;
(function (ClientCode) {
    ClientCode[ClientCode["ConnClose"] = 0] = "ConnClose";
    ClientCode[ClientCode["Listening"] = 1] = "Listening";
    ClientCode[ClientCode["MsgOutgoing"] = 2] = "MsgOutgoing";
})(ClientCode || (ClientCode = {}));
//@ts-ignore
window.initClient = function () {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://${window.location.host}/wschat`);
        let clientData;
        function sendMsg(author, content) {
            if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING)
                return;
            console.log(author, content);
            clientData.name = author;
            ws.send(JSON.stringify({
                type: ClientCode.MsgOutgoing,
                detail: {
                    id: clientData.id,
                    author,
                    content,
                    date: new Date(Date.now()).toString(),
                },
            }));
        }
        function messageHandler(ev) {
            const { type, detail } = JSON.parse(ev.data);
            let event;
            console.log("server msg received", type, detail);
            switch (type) {
                case ServerCode.ConnClose:
                    event = new CustomEvent("ws-conn-close", { detail });
                    break;
                case ServerCode.ConnOpen:
                    clientData = detail;
                    ws.send(JSON.stringify({ type: ClientCode.Listening }));
                    event = new CustomEvent("ws-conn-open", { detail });
                    break;
                case ServerCode.MsgIncoming:
                    event = new CustomEvent("ws-message", { detail });
                    break;
                case ServerCode.LobbyInfo:
                    event = new CustomEvent("ws-lobbyinfo", { detail });
            }
            event && window.dispatchEvent(event);
        }
        ws.onopen = function () {
            ws.onmessage = messageHandler;
            resolve(sendMsg);
        };
        ws.onerror = function (ev) {
            reject(ev);
        };
    });
};
// //@ts-ignore
// window.sendJSON = function (obj: object) {
//   return { json: JSON.stringify(obj) };
// };

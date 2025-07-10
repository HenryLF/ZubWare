enum ServerCode {
  ConnClose = 0,
  ConnOpen = 1,
  MsgIncoming = 2,
  HubInfo = 3,
}
enum ClientCode {
  ConnClose = 0,
  Listening = 1,
  MsgOutgoing = 2,
}

type MessageData = {
  id: string;
  author: string;
  content: string;
  date: string;
};

type ClientData = {
  id: string;
  name: string;
};

type LobbyData = ClientData[];

type ServerMessage =
  | {
      type: ServerCode.ConnClose;
      detail: any;
    }
  | {
      type: ServerCode.ConnOpen;
      detail: ClientData;
    }
  | {
      type: ServerCode.MsgIncoming;
      detail: MessageData;
    }
  | {
      type: ServerCode.HubInfo;
      detail: LobbyData;
    };

export function initClient() {
  return new Promise<(author: string, content: string) => void>(
    (resolve, reject) => {
      const ws = new WebSocket(`ws://${window.location.host}/wschat`);
      let clientData: ClientData;

      function sendMsg(author: string, content: string) {
        if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING) return;
        console.log(author, content);
        clientData.name = author;
        ws.send(
          JSON.stringify({
            type: ClientCode.MsgOutgoing,
            detail: {
              id: clientData.id,
              author,
              content,
              date: new Date(Date.now()).toString(),
            },
          })
        );
      }

      function messageHandler(ev: MessageEvent) {
        const { type, detail } = JSON.parse(ev.data) as ServerMessage;
        let event: CustomEvent;
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
          case ServerCode.HubInfo:
            event = new CustomEvent("ws-lobbyinfo", { detail });
        }
        event && window.dispatchEvent(event);
      }

      ws.onopen = function () {
        ws.onmessage = messageHandler;
        resolve(sendMsg);
      };
      ws.onerror = function (ev: Event) {
        reject(ev);
      };
    }
  );
}

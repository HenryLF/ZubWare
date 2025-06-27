enum ServerCode {
  ConnClose = 0,
  ConnOpen = 1,
  MsgIncoming = 2,
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

type ServerMessage =
  | {
      type: ServerCode.ConnClose;
      detail: any;
    }
  | {
      type: ServerCode.ConnOpen;
      detail: string
    }
  | {
      type: ServerCode.MsgIncoming;
      detail: MessageData;
    };

type ClientMessage =
  | {
      type: ClientCode.ConnClose;
      detail: any;
    }
  | {
      type: ClientCode.Listening;
    }
  | {
      type: ServerCode.MsgIncoming;
      detail: MessageData;
    };

//@ts-ignore
window.initClient = function () {
  return new Promise<(author: string, content: string) => void>(
    (resolve, reject) => {
      const ws = new WebSocket(`ws://${window.location.host}/wschat`);
      let clientId: string;

      function sendMsg(author: string, content: string) {
        if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING) return;
        console.log(author, content);
        ws.send(
          JSON.stringify({
            type: ClientCode.MsgOutgoing,
            detail: {
              id: clientId,
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
            break
          case ServerCode.ConnOpen:
            clientId = detail;
            ws.send(JSON.stringify({ type: ClientCode.Listening }));
            event = new CustomEvent("ws-conn-open", { detail });
            break
          case ServerCode.MsgIncoming:
            event = new CustomEvent("ws-message", { detail });
            
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
};

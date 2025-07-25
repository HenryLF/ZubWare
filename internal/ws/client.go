package ws

import (
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	PONG_WAIT    = 3 * time.Second
	WRITE_WAIT   = 1 * time.Second
	PING_PERIOD  = (PONG_WAIT * 9) / 10
	DEFAULT_NAME = "AnonymousFcker"
)

var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type client struct {
	conn        *websocket.Conn
	broadcaster *broadcaster
	send        chan ServerMessage
	id          uuid.UUID
	name        string
	closed      bool
}

func (c *client) Info() ClientInfo {
	return ClientInfo{
		c.id, c.name,
	}
}
func (c *client) SetName(s string) {
	c.name = s
}

func (c *client) Close() {
	c.closed = true
	c.conn.Close()
	c.broadcaster.close()
}

func (c *client) Sub(code ClientCode) chan ClientMessage {
	if c.closed {
		return nil
	}
	ch := make(chan ClientMessage, 10)
	c.broadcaster.reg <- struct {
		code ClientCode
		ch   chan ClientMessage
	}{code, ch}
	return ch
}

func (c *client) UnSub(code ClientCode, ch chan ClientMessage) {
	if c.closed {
		return
	}
	c.broadcaster.unreg <- struct {
		code ClientCode
		ch   chan ClientMessage
	}{code, ch}
}

func (c *client) Send(msg ServerMessage) {
	c.send <- msg
}

func (c *client) readPump() {
	defer c.Close()
	c.conn.SetReadDeadline(time.Now().Add(PONG_WAIT))

	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(PONG_WAIT))
		return nil
	})

	for {
		msg := ClientMessage{}
		err := c.conn.ReadJSON(&msg)
		if err != nil {
			log.Println("PlayerReadJSON :: ", err)
			if websocket.IsUnexpectedCloseError(err) {
				log.Print("...closing")
				return
			}
		}
		c.conn.SetReadDeadline(time.Now().Add(PONG_WAIT))
		c.broadcaster.input <- msg
	}
}

func (c *client) writePump() {
	ticker := time.NewTicker(PING_PERIOD)

	defer func() {
		ticker.Stop()
		c.Close()
	}()

	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(WRITE_WAIT))
			if !ok {
				log.Println("PlayerWrite : Send chan closed.")
				return
			}
			err := c.conn.WriteJSON(msg)
			if err != nil {
				log.Println("PlayerWriteJSON ::", c.id, err)
				if websocket.IsUnexpectedCloseError(err) {
					log.Print("...closing")
					return
				}
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(WRITE_WAIT))
			err := c.conn.WriteMessage(websocket.PingMessage, nil)
			if websocket.IsUnexpectedCloseError(err) {
				log.Println("PlayerWritePing :: ", c.id, err)
				log.Print("...closing")
				return
			}
		}
	}
}

func NewClient(w http.ResponseWriter, r *http.Request) (Client, error) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}

	c := &client{
		conn:        conn,
		broadcaster: newBroadcaster(),
		send:        make(chan ServerMessage, 10),
		id:          uuid.New(),
		name:        DEFAULT_NAME,
	}
	go c.readPump()
	go c.writePump()

	return c, nil

}

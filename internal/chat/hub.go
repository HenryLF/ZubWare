package chat

import (
	"errors"
	"net/http"
	"time"
	"zubware/internal/ws"
)

const (
	CLIENT_LISTEN_TIMEOUT = 5 * time.Second
)

type hub struct {
	user      map[ws.Client]struct{}
	broadcast chan ws.ServerMessage
	reg       chan ws.Client
	unreg     chan ws.Client
}

func NewHub() *hub {
	hub := hub{user: map[ws.Client]struct{}{},
		broadcast: make(chan ws.ServerMessage),
		reg:       make(chan ws.Client),
		unreg:     make(chan ws.Client),
	}

	go hub.run()

	return &hub
}

func (h *hub) run() {
	for {
		select {
		case sub := <-h.reg:
			h.user[sub] = struct{}{}
			go h.handleClient(sub)
		case unsub := <-h.unreg:
			delete(h.user, unsub)
		case msg := <-h.broadcast:
			for user := range h.user {
				go func(u ws.Client) {
					u.Send(msg)
				}(user)
			}
		}

	}
}

func (h *hub) handleClient(sub ws.Client) {
	msgCh := sub.Sub(ws.ClientMsg)
	closeCh := sub.Sub(ws.ClientConnClose)
	defer sub.UnSub(ws.ClientMsg, msgCh)
	defer sub.UnSub(ws.ClientConnClose, closeCh)
	for {
		select {
		case msg, ok := <-msgCh:
			if !ok {
				h.unreg <- sub
				return
			}
			h.broadcast <- ws.ServerMessage{Type: ws.ServerMsg, Payload: msg.Payload}
		case <-closeCh:
			h.unreg <- sub
			return
		}

	}
}

func (h *hub) AddClient(w http.ResponseWriter, r *http.Request) error {
	c, err := ws.NewClient(w, r)
	if err != nil {
		return err
	}

	ch := c.Sub(ws.ClientListening)
	defer c.UnSub(ws.ClientListening, ch)

	c.Send(ws.ServerMessage{Type: ws.ServerConnOpen, Payload: c.Id()})

	select {
	case <-ch:
		h.reg <- c
	case <-time.After(CLIENT_LISTEN_TIMEOUT):
		return errors.New("client not listening")
	}
	return nil
}

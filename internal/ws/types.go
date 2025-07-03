package ws

import "github.com/google/uuid"

type ServerCode int

const (
	ServerConnClose = ServerCode(iota)
	ServerConnOpen
	ServerMsg
	ServerLobbyInfo
)

type ClientCode int

const (
	ClientConnClose = ClientCode(iota)
	ClientListening
	ClientMsg
)

type ClientMessage struct {
	Type    ClientCode `json:"type"`
	Payload any        `json:"detail"`
}
type ClientInfo struct {
	Id   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type ServerMessage struct {
	Type    ServerCode `json:"type"`
	Payload any        `json:"detail"`
}

type Client interface {
	Close()
	Sub(code ClientCode) chan ClientMessage
	UnSub(code ClientCode, ch chan ClientMessage)
	Send(msg ServerMessage)
	Info() ClientInfo
	SetName(string)
}

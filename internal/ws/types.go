package ws

type ServerCode int

const (
	ServerConnClose = ServerCode(iota)
	ServerConnOpen
	ServerMsg
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

type ServerMessage struct {
	Type    ServerCode `json:"type"`
	Payload any        `json:"detail"`
}

type Client interface {
	Close()
	Sub(code ClientCode) chan ClientMessage
	UnSub(code ClientCode, ch chan ClientMessage)
	Send(msg ServerMessage)
	Id() string
}

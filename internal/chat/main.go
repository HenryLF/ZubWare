package chat

import (
	"log"
	"net/http"
)

var Hub = NewHub()

func ChatServer(w http.ResponseWriter, r *http.Request) {
	err := Hub.AddClient(w, r)
	if err != nil {
		log.Println("chat", err)
		return
	}
}

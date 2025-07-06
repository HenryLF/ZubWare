package main

import (
	"net/http"
	"zubware/internal/chat"
	"zubware/internal/handles"
	"zubware/internal/utils"
)

var FileServer = http.FileServer(http.Dir("static/"))

func main() {
	var router = http.NewServeMux()

	router.HandleFunc("/", utils.HttpLogger(FileServer))

	router.HandleFunc("/new-todo", utils.HttpLoggerFunc(handles.Todos))
	router.HandleFunc("/new-entry-point", utils.HttpLoggerFunc(handles.NewEntryPoint))
	router.HandleFunc("/api/{id}", utils.HttpLoggerFunc(handles.ServeEntryPoint))
	router.HandleFunc("/wschat", chat.ChatServer)

	http.Handle("/", router)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}

package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/joho/godotenv"
)

func init() {
	fmt.Println(runtime.NumCPU())
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	fmt.Println("this ran...")

	hub := newHub()
	td := newTwitchData()

	var payload []byte

	go hub.run()
	go td.populateTwitchData(hub, &payload)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, &payload)
	})

	http.ListenAndServe(":5010", nil)
}

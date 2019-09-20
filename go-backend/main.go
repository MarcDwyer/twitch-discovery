package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
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

	mux := http.NewServeMux()

	// TwitchData converted to bytes
	var payload []byte

	// Create webscoket hub
	hub := newHub()
	// create new instance of TwitchData and pass hub & payload to broadcast to clients
	td := newTwitchData(hub, &payload)

	go hub.run()

	// build up the TwitchData
	go td.populateTwitchData()

	//Sets timers to update data
	go td.setTimers()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, &payload)
	})
	mux.HandleFunc("/set-offset/", func(w http.ResponseWriter, r *http.Request) {
		td.setOffset(w, r)
	})
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":5010", handler)
}

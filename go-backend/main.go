package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"

	"github.com/MarcDwyer/twitchgo"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var t *twitchgo.Twitch

func init() {
	fmt.Println(runtime.NumCPU())
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	mux := http.NewServeMux()

	t = twitchgo.NewTwitchInstance(os.Getenv("TWITCH"))
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
	go td.setTimes()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, &payload)
	})
	mux.HandleFunc("/set-offset/", func(w http.ResponseWriter, r *http.Request) {
		td.setOffset(w, r)
	})
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":5010", handler)
}

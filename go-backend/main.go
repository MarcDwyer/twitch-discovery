package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/rs/cors"

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

	mux := http.NewServeMux()

	hub := newHub()
	td := newTwitchData(hub)

	go hub.run()
	go td.populateTwitchData()
	go td.setTimers()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, td)
	})
	mux.HandleFunc("/set-offset/", func(w http.ResponseWriter, r *http.Request) {
		td.setOffset(w, r)
	})
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":5010", handler)
}

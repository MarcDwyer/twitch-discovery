package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"github.com/rs/cors"

	"github.com/joho/godotenv"
)

var (
	newStreams    = 3
	refreshStream = 15
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
	go setTimers(td)

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, td)
	})
	mux.HandleFunc("/set-offset/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("triggered")
		td.setOffset(w, r)
	})
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":5010", handler)
}

func setTimers(td *TwitchData) {
	go func() {
		refresh := time.Tick(time.Duration(refreshStream) * time.Minute)
		for range refresh {
			go td.refreshStreams()
		}
	}()
	go func() {
		newList := time.Tick(time.Duration(newStreams) * time.Minute)
		for range newList {
			go td.populateTwitchData()
		}
	}()
}

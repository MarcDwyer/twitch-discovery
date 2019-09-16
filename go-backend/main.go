package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"github.com/joho/godotenv"
)

var (
	newStreams    = 35
	refreshStream = 1
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

	go func() {
		timerCh := time.Tick(time.Duration(refreshStream) * time.Minute)
		for range timerCh {
			go td.refreshStreams(hub, &payload)
		}
	}()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, &payload)
	})

	http.ListenAndServe(":5010", nil)
}

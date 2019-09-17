package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"github.com/joho/godotenv"
)

type Offset struct {
	Offset float64 `json:"offset"`
	Secret string  `json:"secret"`
}

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

	hub := newHub()
	td := newTwitchData(hub)

	go hub.run()
	go td.populateTwitchData()
	go setTimers(td)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r, td)
	})
	http.HandleFunc("/set-offset/", func(w http.ResponseWriter, r *http.Request) {
		td.setOffset(w, r)
	})
	http.ListenAndServe(":5010", nil)
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

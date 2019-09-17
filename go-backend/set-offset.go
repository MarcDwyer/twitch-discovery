package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
)

type Offset struct {
	Offset string `json:"offset"`
	Secret string `json:"secret"`
}

func (tData *TwitchData) setOffset(w http.ResponseWriter, r *http.Request) {
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json")

	payload := &Offset{}
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Error converting body", 500)
		return
	}
	parsedOffset, err := strconv.ParseFloat(payload.Offset, 64)
	if err != nil {
		http.Error(w, "Error parse offset", 400)
		return
	}
	if payload.Secret == os.Getenv("YEET") {
		offsetRef = parsedOffset
		tData.populateTwitchData()
	} else {
		http.Error(w, "Secrets dont match", 401)
	}
}

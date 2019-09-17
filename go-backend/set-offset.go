package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
)

func (tData *TwitchData) setOffset(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error converting body", 500)
		return
	}
	payload := Offset{}
	json.Unmarshal(body, &payload)
	if payload.Secret == os.Getenv("SECRET") {
		tData.Diagnostic.Offset = payload.Offset
		tData.populateTwitchData()
	} else {
		http.Error(w, "Secrets dont match", 401)
	}
}

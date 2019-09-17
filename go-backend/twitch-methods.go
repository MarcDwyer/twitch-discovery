package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func fetchTwitch(url string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.twitchtv.v5+json")
	req.Header.Set("Client-ID", os.Getenv("TWITCH"))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatalf("Error fetching twitch data")
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	return body, err
}

func getTotal() int {
	url := "https://api.twitch.tv/kraken/streams/?limit=1&language=en"
	resp, err := fetchTwitch(url)
	if err != nil {
		log.Printf("error fetching total")
	}
	var data TResponse
	json.Unmarshal(resp, &data)
	return data.Total
}

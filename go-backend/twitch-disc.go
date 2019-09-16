package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"time"
)

func newTwitchData() *TwitchData {
	return &TwitchData{}
}

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
func (tData *TwitchData) getDiagData() {
	total := getTotal()
	skippedOver := math.Floor(float64(total) * tData.Diagnostic.Offset)
	newOffset := tData.Diagnostic.Offset

	if tData.StreamData != nil {
		newOffset = newOffset + 0.025
	}
	newDiag := Diag{
		Offset:      newOffset,
		Total:       total,
		SkippedOver: int(skippedOver),
	}
	tData.Diagnostic = newDiag
}

func getTime() int64 {
	nowTime := time.Now().Add(time.Minute * time.Duration(newStreams))
	now := nowTime.UnixNano() / int64(time.Millisecond)
	return now
}

func (tData *TwitchData) getNewStreams() {
	url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/?limit=10&offset=%d&language=en", tData.Diagnostic.SkippedOver)
	streamBytes, err := fetchTwitch(url)
	if err != nil {
		log.Fatalf("Error fetching new streams")
	}
	streamers := TResponse{}
	json.Unmarshal(streamBytes, &streamers)

	tData.StreamData = structureStreams(streamers.Streams)
	tData.Online = &streamers.Streams
	tData.NextRefresh = getTime()
}

func (tData *TwitchData) populateTwitchData(h *Hub, p *[]byte) {
	tData.getDiagData()
	tData.getNewStreams()
	newPayload := Payload1{
		Data: *tData,
		Type: "init-data",
	}
	payload, err := json.Marshal(newPayload)
	if err != nil {
		log.Fatal(err)
	}
	*p = payload
	h.broadcast <- *p
}

func (tData *TwitchData) refreshStreams(h *Hub, p *[]byte) {
	newStreamers := []Stream{}
	fmt.Println("refresh ran")
	for _, v := range *tData.StreamData {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v", v.ID)
		data, err := fetchTwitch(url)
		if err != nil {
			continue
		}
		var stream SingleResponse
		json.Unmarshal(data, &stream)

		newStream := Stream{
			StreamName:  v.StreamName,
			ChannelData: v.ChannelData,
			Stream:      &stream.Stream,
			ID:          v.ID,
		}
		newStreamers = append(newStreamers, newStream)
	}
	tData.StreamData = &newStreamers
	tData.Online = filterLive(newStreamers)

	payload := &Payload2{
		Online:     *tData.Online,
		StreamData: *tData.StreamData,
		Type:       "updated-data",
	}
	res, _ := json.Marshal(payload)
	*p = res
	h.broadcast <- res
}

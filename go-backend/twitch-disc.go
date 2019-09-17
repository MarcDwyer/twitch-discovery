package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"time"
)

func newTwitchData(hub *Hub) *TwitchData {
	return &TwitchData{
		Hub: hub,
	}
}

var offsetRef float64

func (tData *TwitchData) getDiagData() {
	total := getTotal()
	if offsetRef+.0025 >= .85 {
		offsetRef = 0
	}
	tData.Diagnostic.Offset = offsetRef
	offsetRef += .0025
	skippedOver := math.Round(float64(total) * tData.Diagnostic.Offset)
	newDiag := Diag{
		Offset:      tData.Diagnostic.Offset,
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

func (tData *TwitchData) populateTwitchData() {
	tData.getDiagData()
	tData.getNewStreams()

	payload, err := json.Marshal(tData.givePayload())
	if err != nil {
		log.Fatal(err)
	}
	tData.Hub.broadcast <- payload
}

func (tData *TwitchData) refreshStreams() {
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
	tData.Hub.broadcast <- res
}

func (tData *TwitchData) givePayload() TwitchData {
	copy := *tData
	copy.Hub = nil
	return copy
}

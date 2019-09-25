package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"time"
)

type TwitchData struct {
	StreamData  map[string]Stream `json:"streams,omitempty"`
	NextRefresh int64             `json:"nextRefresh,omitempty"`
	Diagnostic  Diag              `json:"diagnostic,omitempty"`
	Hub         *Hub              `json:",omitempty"`
	MyTimers    *IMyTimers        `json:",omitempty"`
	Payload     *[]byte           `json:",omitempty"`
}
type IMyTimers struct {
	RefreshTimer    *SubTimer
	NewStreamsTimer *SubTimer
}
type SubTimer struct {
	myTime int64
	timer  *time.Timer
}

func newTwitchData(hub *Hub, payload *[]byte) *TwitchData {
	return &TwitchData{
		Hub:     hub,
		Payload: payload,
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

func (tData *TwitchData) getNewStreams() {
	url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/?limit=10&offset=%d&language=en", tData.Diagnostic.SkippedOver)
	streamBytes, err := fetchTwitch(url)
	if err != nil {
		log.Fatalf("Error fetching new streams")
	}
	streamers := TResponse{}
	json.Unmarshal(streamBytes, &streamers)

	tData.StreamData = structureStreams(streamers.Streams)
}

func (tData *TwitchData) populateTwitchData() {
	tData.getDiagData()
	tData.getNewStreams()
	tData.NextRefresh = getTime(tData.MyTimers.NewStreamsTimer.myTime)
	if tData.StreamData != nil {
		go resetTimer(tData.MyTimers.NewStreamsTimer)
		go resetTimer(tData.MyTimers.RefreshTimer)
	}

	tData.setPayload()
	tData.Hub.broadcast <- *tData.Payload
}

func (tData *TwitchData) refreshStreams() {
	fmt.Println("refresh ran")
	offlineCount := 0
	for key, v := range tData.StreamData {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v", v.ID)
		data, err := fetchTwitch(url)
		if err != nil {
			continue
		}
		var stream SingleResponse
		json.Unmarshal(data, &stream)

		if val, ok := tData.StreamData[key]; ok {
			val.Stream = stream.Stream
			tData.StreamData[key] = val
		} else {
			offlineCount++
		}
	}
	if len(tData.StreamData) == offlineCount {
		go tData.getNewStreams()
		return
	}
	go tData.setPayload()
	payload := &Payload2{
		StreamData: tData.StreamData,
		Type:       "updated-data",
	}
	res, _ := json.Marshal(payload)
	tData.Hub.broadcast <- res
}

func givePayload(tData *TwitchData) TwitchData {
	copy := *tData
	copy.Hub = nil
	copy.MyTimers = nil
	copy.Payload = nil
	return copy
}

func (tData *TwitchData) setPayload() {
	trimmedData := givePayload(tData)
	rs, _ := json.Marshal(trimmedData)

	*tData.Payload = rs
}

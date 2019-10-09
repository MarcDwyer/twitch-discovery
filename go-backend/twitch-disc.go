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
	MyTimes     *IMyTimers        `json:",omitempty"`
	Payload     *[]byte           `json:",omitempty"`
}
type Diag struct {
	SkippedOver int     `json:"skippedOver"`
	Offset      float64 `json:"offset"`
	Total       int     `json:"total"`
}
type IMyTimers struct {
	RefreshTimer    *SubTimer
	NewStreamsTimer *SubTimer
}
type SubTimer struct {
	duration time.Duration
	timer    *time.Timer
	time     int64
}

func newTwitchData(hub *Hub, payload *[]byte) *TwitchData {
	return &TwitchData{
		Hub:     hub,
		Payload: payload,
	}
}

var (
	offsetRef   float64
	updatedData = "updated-data"
	newData     = "new-data"
)

func getDiagData() Diag {
	total := getTotal()
	if offsetRef+.0025 >= .85 {
		offsetRef = 0
	}
	skippedOver := math.Round(float64(total) * offsetRef)
	newDiag := Diag{
		Offset:      offsetRef,
		Total:       total,
		SkippedOver: int(skippedOver),
	}
	defer func() {
		offsetRef += .0025
	}()
	return newDiag
}

func getNewStreams(o int) (map[string]Stream, error) {
	url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/?limit=18&offset=%v&language=en", o)
	streamBytes, err := fetchTwitch(url, "GET")
	if err != nil {
		return nil, fmt.Errorf("Error fetching new Streams")
	}
	var streamers TResponse
	json.Unmarshal(streamBytes, &streamers)
	s := structureStreams(streamers.Streams)
	return s, nil
}

func (tData *TwitchData) refreshStreams() {
	fmt.Println("refresh ran")
	for _, v := range tData.StreamData {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v", v.ID)
		res, err := fetchTwitch(url, "GET")
		if err != nil {
			log.Fatalln(err)
		}
		var data SingleResponse
		json.Unmarshal(res, &data)
		if obj, ok := tData.StreamData[v.StreamName]; ok {
			obj.Stream = data.Stream
			tData.StreamData[v.StreamName] = obj
		}
	}
	go tData.setPayload()
	tData.broadCastData(updatedData)
}

func (tData *TwitchData) populateTwitchData() {
	newDiag := getDiagData()
	streams, err := getNewStreams(newDiag.SkippedOver)
	if err != nil {
		fmt.Println(err)
		return
	}
	tData.StreamData = streams
	tData.Diagnostic = newDiag
	tData.NextRefresh = getTime(tData.MyTimes.NewStreamsTimer.time)
	if tData.StreamData != nil {
		go resetTimer(tData.MyTimes.NewStreamsTimer)
		go resetTimer(tData.MyTimes.RefreshTimer)
	}
	tData.setPayload()
	tData.broadCastData(newData)
}

func givePayload(tData *TwitchData) TwitchData {
	copy := *tData
	copy.Hub = nil
	copy.MyTimes = nil
	copy.Payload = nil
	return copy
}

func (tData *TwitchData) setPayload() {
	trimmedData := givePayload(tData)
	rs, _ := json.Marshal(trimmedData)

	*tData.Payload = rs
}

func (tData *TwitchData) broadCastData(action string) {
	switch action {
	case newData:
		tData.Hub.broadcast <- *tData.Payload
		break
	case updatedData:
		payload := &Payload2{
			StreamData: tData.StreamData,
			Type:       "updated-data",
		}
		res, _ := json.Marshal(payload)
		tData.Hub.broadcast <- res
	}
}

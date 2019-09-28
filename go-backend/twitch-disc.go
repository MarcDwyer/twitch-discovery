package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"strings"
	"time"
)

type TwitchData struct {
	StreamData  []TStreams `json:"streams,omitempty"`
	NextRefresh int64      `json:"nextRefresh,omitempty"`
	Diagnostic  Diag       `json:"diagnostic,omitempty"`
	Hub         *Hub       `json:",omitempty"`
	MyTimes     *IMyTimers `json:",omitempty"`
	Payload     *[]byte    `json:",omitempty"`
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
	url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/?limit=15&offset=%d&language=en", tData.Diagnostic.SkippedOver)
	streamBytes, err := fetchTwitch(url, "GET")
	if err != nil {
		log.Println("Error fetching new streams")
		return
	}
	streamers := TResponse{}
	json.Unmarshal(streamBytes, &streamers)
	tData.StreamData = streamers.Streams
}

func (tData *TwitchData) refreshStreams() {
	fmt.Println("refresh ran")
	ids := []int{}
	for _, v := range tData.StreamData {
		ids = append(ids, v.Channel.ID)
	}
	strIds := arrayToString(ids, ",")

	url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/?channel=%s", strIds)

	refBytes, err := fetchTwitch(url, "GET")
	if err != nil {
		log.Fatalln(err)
	}

	var twitchData TResponse
	err = json.Unmarshal(refBytes, &twitchData)
	if err != nil {
		log.Fatalln(err)
	} else if len(twitchData.Streams) < 1 {
		go tData.populateTwitchData()
		return
	}
	tData.StreamData = twitchData.Streams
	go tData.setPayload()
	tData.broadCastData(updatedData)
}

func arrayToString(ids []int, delim string) string {
	return strings.Trim(strings.Join(strings.Fields(fmt.Sprint(ids)), delim), "[]")
}

func (tData *TwitchData) populateTwitchData() {
	tData.getDiagData()
	tData.getNewStreams()
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

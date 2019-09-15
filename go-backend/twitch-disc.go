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

type TResponse struct {
	Total   int        `json:"_total"`
	Streams []TStreams `json:"streams"`
}
type TStreams struct {
	ID         int64     `json:"_id"`
	AverageFps int       `json:"average_fps"`
	Channel    TChannel  `json:"channel"`
	CreatedAt  time.Time `json:"created_at"`
	Delay      int       `json:"delay"`
	Game       string    `json:"game"`
	IsPlaylist bool      `json:"is_playlist"`
	Preview    struct {
		Large    string `json:"large"`
		Medium   string `json:"medium"`
		Small    string `json:"small"`
		Template string `json:"template"`
	} `json:"preview"`
	VideoHeight int `json:"video_height"`
	Viewers     int `json:"viewers"`
}
type TChannel struct {
	ID                           int         `json:"_id"`
	BroadcasterLanguage          string      `json:"broadcaster_language"`
	CreatedAt                    time.Time   `json:"created_at"`
	DisplayName                  string      `json:"display_name"`
	Followers                    int         `json:"followers"`
	Game                         string      `json:"game"`
	Language                     string      `json:"language"`
	Logo                         string      `json:"logo"`
	Mature                       bool        `json:"mature"`
	Name                         string      `json:"name"`
	Partner                      bool        `json:"partner"`
	ProfileBanner                string      `json:"profile_banner"`
	ProfileBannerBackgroundColor interface{} `json:"profile_banner_background_color"`
	Status                       string      `json:"status"`
	UpdatedAt                    time.Time   `json:"updated_at"`
	URL                          string      `json:"url"`
	VideoBanner                  string      `json:"video_banner"`
	Views                        int         `json:"views"`
}

type Stream struct {
	Stream      TStreams `json:"streamData"`
	StreamName  string   `json:"streamName"`
	ChannelData TChannel `json:"channelData"`
	ID          int      `json:"id"`
}
type Diag struct {
	SkippedOver int     `json:"skippedOver"`
	Offset      float64 `json:"offset"`
	Total       int     `json:"total"`
}
type TwitchData struct {
	StreamData  *[]Stream   `json:"streams,omitempty"`
	NextRefresh int64       `json:"nextRefresh,omitempty"`
	Online      *[]TStreams `json:"online,omitempty"`
	Diagnostic  Diag        `json:"diagnostic,omitempty"`
}
type Payload1 struct {
	Data TwitchData `json:"data"`
	Type string     `json:"type"`
}

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

	if newOffset == 0 && tData.StreamData != nil {
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
	nowTime := time.Now().Add(time.Minute * 35)
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

func structureStreams(s []TStreams) *[]Stream {
	structuredStreams := []Stream{}
	for _, v := range s {
		stream := Stream{
			StreamName:  v.Channel.Name,
			ChannelData: v.Channel,
			ID:          v.Channel.ID,
			Stream:      v,
		}
		structuredStreams = append(structuredStreams, stream)
	}
	return &structuredStreams
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

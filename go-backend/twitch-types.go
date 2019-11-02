package main

import (
	"github.com/MarcDwyer/twitchgo"
)

type Stream struct {
	Stream      *twitchgo.TStreams `json:"streamData"`
	StreamName  string             `json:"streamName"`
	ChannelData twitchgo.TChannel  `json:"channelData"`
	ID          int                `json:"id"`
}

type Times struct {
	refreshTime    int64
	newStreamsTime int64
}
type Payload1 struct {
	Data TwitchData `json:"data"`
	Type string     `json:"type"`
}

type Payload2 struct {
	StreamData map[string]Stream `json:"streams"`
	Type       string            `json:"type"`
}

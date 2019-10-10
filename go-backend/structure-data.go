package main

import (
	"github.com/MarcDwyer/twitch"
)

func structureStreams(streams []twitch.TStreams) map[string]Stream {
	result := map[string]Stream{}
	for i, v := range streams {
		structured := Stream{
			StreamName:  v.Channel.Name,
			ChannelData: v.Channel,
			Stream:      &streams[i],
			ID:          v.Channel.ID,
		}
		result[structured.StreamName] = structured
	}
	return result
}

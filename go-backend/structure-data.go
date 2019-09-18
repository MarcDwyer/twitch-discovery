package main

func structureStreams(s []TStreams) *[]Stream {
	structuredStreams := []Stream{}
	for i, v := range s {
		stream := Stream{
			StreamName:  v.Channel.Name,
			ChannelData: v.Channel,
			ID:          v.Channel.ID,
			Stream:      &s[i],
		}
		structuredStreams = append(structuredStreams, stream)
	}
	return &structuredStreams
}

func filterLive(s []Stream) []TStreams {
	liveStreams := []TStreams{}
	for _, v := range s {
		if v.Stream != nil {
			liveStreams = append(liveStreams, *v.Stream)
		}
	}
	return liveStreams
}

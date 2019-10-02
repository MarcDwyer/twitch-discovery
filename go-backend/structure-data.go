package main

func checkLive(streams []*TStreams) []TStreams {
	live := []TStreams{}
	for _, v := range streams {
		if v != nil {
			live = append(live, *v)
		}
	}
	return live
}

func structureStreams(streams []TStreams) map[string]Stream {
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

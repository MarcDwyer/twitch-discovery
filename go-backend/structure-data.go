package main

func structureStreams(s []TStreams) map[string]Stream {
	ss := make(map[string]Stream)
	for i, v := range s {
		stream := Stream{
			StreamName:  v.Channel.Name,
			ChannelData: v.Channel,
			ID:          v.Channel.ID,
			Stream:      &s[i],
		}
		ss[v.Channel.Name] = stream
	}
	return ss
}

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

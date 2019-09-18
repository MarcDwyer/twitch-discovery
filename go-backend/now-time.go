package main

import "time"

func getTime(n int64) int64 {
	nowTime := time.Now().Add(time.Minute * time.Duration(n))
	now := nowTime.UnixNano() / int64(time.Millisecond)
	return now
}

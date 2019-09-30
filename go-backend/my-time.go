package main

import (
	"fmt"
	"time"
)

func (tData *TwitchData) setTimes() {
	refTime := int64(6)
	newTime := int64(45)

	myTimers := &IMyTimers{
		RefreshTimer: &SubTimer{
			timer:    nil,
			duration: time.Minute * time.Duration(refTime),
			time:     refTime,
		},
		NewStreamsTimer: &SubTimer{
			timer:    nil,
			duration: time.Minute * time.Duration(newTime),
			time:     newTime,
		},
	}

	myTimers.RefreshTimer.timer = time.NewTimer(myTimers.RefreshTimer.duration)
	myTimers.NewStreamsTimer.timer = time.NewTimer(myTimers.NewStreamsTimer.duration)

	tData.MyTimes = myTimers
	go tData.timeListener()
}

func (tData *TwitchData) timeListener() {
	for {
		select {
		case <-tData.MyTimes.NewStreamsTimer.timer.C:
			fmt.Println("newstreams timer ran...")
			go tData.populateTwitchData()
			break
		case <-tData.MyTimes.RefreshTimer.timer.C:
			fmt.Println("refresh timer ran...")
			resetTimer(tData.MyTimes.RefreshTimer)
			go tData.refreshStreams()
			break
		}
	}
}

func resetTimer(s *SubTimer) {
	s.timer.Reset(s.duration)
}

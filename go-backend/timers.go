package main

import (
	"fmt"
	"time"
)

func (tData *TwitchData) setTimers() {
	myTimers := &IMyTimers{
		RefreshTimer: &SubTimer{
			timer:  nil,
			myTime: int64(4),
		},
		NewStreamsTimer: &SubTimer{
			timer:  nil,
			myTime: int64(33),
		},
	}

	myTimers.RefreshTimer.timer = time.NewTimer(time.Minute * time.Duration(myTimers.RefreshTimer.myTime))
	myTimers.NewStreamsTimer.timer = time.NewTimer(time.Minute * time.Duration(myTimers.NewStreamsTimer.myTime))

	tData.MyTimers = myTimers
	go tData.timeListener()
}

func (tData *TwitchData) timeListener() {
	for {
		select {
		case <-tData.MyTimers.NewStreamsTimer.timer.C:
			fmt.Println("newstreams timer ran...")
			go tData.populateTwitchData()
		case <-tData.MyTimers.RefreshTimer.timer.C:
			fmt.Println("refresh timer ran...")
			resetTimer(tData.MyTimers.RefreshTimer)
			go tData.refreshStreams()
		}
	}
}

func resetTimer(s *SubTimer) {
	s.timer.Reset(time.Minute * time.Duration(s.myTime))
}

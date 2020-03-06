package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	"github.com/rs/cors"
)

// export const BPAYLOAD = "payload",
//   BREFRESH = "refresh";

var (
	bPayload = "payload"
	bRefresh = "refresh"
)

func (s *customServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	origin := r.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	s.Server.ServeHTTP(w, r)
}

func main() {

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	go server.Serve()

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		s.Emit(bPayload, "hello world")
		return nil
	})
	handle := http.Handler{}
	c := cors.AllowAll().Handler()
	defer server.Close()

	http.Handle("/socket.io/", server)
	log.Fatal(http.ListenAndServe(":5010", null))
}

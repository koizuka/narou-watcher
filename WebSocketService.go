package main

import (
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net/http"
	"sync"
)

type WebSocketService struct {
	upgrader websocket.Upgrader
	wg       sync.WaitGroup
	quitChan chan bool
}

func NewWebSocketService() *WebSocketService {
	return &WebSocketService{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true // 誰でもok
			},
		},
		quitChan: make(chan bool),
	}
}

func (ws *WebSocketService) CloseAll() {
	close(ws.quitChan)
}

func (ws *WebSocketService) Wait() {
	ws.wg.Wait()
}

func (ws *WebSocketService) Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Print("websocket accepted.")
	go func() {
		ws.wg.Add(1)
		defer ws.wg.Done()

		defer func() {
			_ = conn.Close()
			log.Print("websocket closed.")
		}()

		type msg struct {
			MessageType int
			R           io.Reader
			Error       error
		}

		readChan := make(chan msg)
		// read loop
		go func() {
			defer close(readChan)
			for {
				messageType, r, err := conn.NextReader()
				readChan <- msg{messageType, r, err}
				if err != nil {
					break
				}
			}
		}()

		for {
			select {
			case msg, ok := <-readChan:
				if !ok {
					return
				}
				if msg.Error != nil {
					log.Println(msg.Error)
					return
				}
				if msg.MessageType == websocket.TextMessage {
					log.Printf("text message: %v", msg.R)
				}
			case <-ws.quitChan:
				_ = conn.Close()
				return
			}
		}
	}()
}

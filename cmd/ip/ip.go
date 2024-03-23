package main

import (
	"duckdns-ui/pkg/duckdns"
	"log"
)

func main() {
	ip, err := duckdns.GetGlobalIP()
	if err != nil {
		log.Fatal(err)
	}
	log.Println(ip)
}

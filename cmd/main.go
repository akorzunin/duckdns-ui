package main

import (
	"duckdns-ui/pkg/db"
	"duckdns-ui/pkg/routes"
	"duckdns-ui/pkg/tasks"
	"log"
	"net/http"
)

func main() {
	if err := db.InitializeDB("./data/data.db"); err != nil {
		log.Fatal("failed to init db:", err)
	}
	defer db.DB.Close()

	if err := tasks.InitScheduler(); err != nil {
		log.Fatal("failed to init scheduler")
	}
	tasks.S.Start()
	defer tasks.S.Shutdown()

	mux := http.NewServeMux()
	mux = routes.AddFrontRoutes(mux)
	mux = routes.AddApiRoutes(mux)

	println("listening at 3000")
	_ = http.ListenAndServe(":3000", mux)
}

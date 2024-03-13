package main

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/db"
	"duckdns-ui/pkg/routes"
	"duckdns-ui/pkg/tasks"
	"log"
	"log/slog"
	"net/http"
	"os"
)

func setupLogger() {
	logLevel := new(slog.LevelVar)
	logLevel.Set(slog.LevelDebug)
	handlerOpts := &slog.HandlerOptions{Level: logLevel}
	var logger *slog.Logger
	if configs.LOG_JSON {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, handlerOpts))
	} else {
		logger = slog.New(slog.NewTextHandler(os.Stdout, handlerOpts))
	}
	slog.SetDefault(logger)
}

func main() {
	setupLogger()
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

	slog.Info("listening at 3000")
	_ = http.ListenAndServe(":3000", mux)
}

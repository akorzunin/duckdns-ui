package main

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/buckets/taskbucket"
	"duckdns-ui/pkg/db"
	"duckdns-ui/pkg/logger"
	"duckdns-ui/pkg/routes"
	"duckdns-ui/pkg/tasks"
	"expvar"
	"log"
	"log/slog"
	"net/http"
)

func main() {
	configs.InitEnvVars()
	logger.SetupLogger()
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
	mux.Handle("/debug/vars", expvar.Handler())

	handler := logger.LogginngMiddleware(mux)
	handler = routes.CorsMiddleware(handler)

	taskbucket.ResotreAllTasks(db.DB)

	slog.Info("listening at 3000")
	_ = http.ListenAndServe(":3000", handler)
}

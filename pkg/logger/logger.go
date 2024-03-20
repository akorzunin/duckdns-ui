package logger

import (
	"duckdns-ui/configs"
	"log/slog"
	"net/http"
	"os"
)

func SetupLogger() *slog.Logger {
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
	return logger
}
func LogginngMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		slog.Info("",
			"method", r.Method,
			"url", r.URL.Path,
			"content-length", r.ContentLength,
			"host", r.Host,
			"referer", r.Referer(),
			"proto", r.Proto,
		)
		handler.ServeHTTP(w, r)
	})
}

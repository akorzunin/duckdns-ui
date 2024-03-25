package routes

import (
	"duckdns-ui/configs"
	"net/http"
)

func AddApiRoutes(mux *http.ServeMux) *http.ServeMux {

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /devmode", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		if configs.DRY_RUN {
			w.Write([]byte("{\"devMode\": true}"))
			return
		}
		w.Write([]byte("{\"devMode\": false}"))
	})
	mux = AddTaskRoutes(mux)
	mux = AddDomainRoutes(mux)
	return mux
}

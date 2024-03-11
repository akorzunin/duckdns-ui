package routes

import (
	"net/http"
)

func AddApiRoutes(mux *http.ServeMux) *http.ServeMux {

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})

	mux = AddTaskRoutes(mux)
	mux = AddDomainRoutes(mux)
	return mux
}

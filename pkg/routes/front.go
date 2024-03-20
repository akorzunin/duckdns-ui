package routes

import "net/http"

func AddFrontRoutes(mux *http.ServeMux) *http.ServeMux {
	mux.HandleFunc("OPTIONS /*", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})
	mux.Handle("GET /{$}", http.RedirectHandler("/app/", 302))
	mux.Handle(
		"GET /assets/",
		http.StripPrefix("/assets/", http.FileServer(http.Dir("./web/dist/assets"))),
	)
	mux.HandleFunc("GET /app/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./web/dist/index.html")
	})
	mux.HandleFunc("GET /favicon.svg", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./web/dist/favicon.svg")
	})
	return mux
}

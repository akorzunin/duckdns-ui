package routes

import "net/http"

func AddFrontRoutes(mux *http.ServeMux) *http.ServeMux {
	mux.Handle("GET /{$}", http.RedirectHandler("/app/", http.StatusFound))
	mux.Handle(
		"GET /assets/",
		http.StripPrefix(
			"/assets/",
			http.FileServer(http.Dir("./web/dist/assets")),
		),
	)
	mux.HandleFunc("GET /app/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./web/dist/index.html")
	})
	mux.HandleFunc(
		"GET /favicon.svg",
		func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "./web/dist/favicon.svg")
		},
	)
	return mux
}

package routes

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/duckdns"
	"duckdns-ui/pkg/tasks"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"slices"
	"time"

	"github.com/go-co-op/gocron/v2"
)

func AddTaskRoutes(mux *http.ServeMux) *http.ServeMux {

	mux.HandleFunc("GET /api/task/{domain}", func(w http.ResponseWriter, r *http.Request) {
		domain := r.PathValue("domain")
		var task tasks.Task
		for _, j := range tasks.S.Jobs() {
			if slices.Contains(j.Tags(), domain) {
				task = tasks.Task{
					Interval: j.Name(),
					Domain:   domain,
				}
				break
			}
		}
		if len(task.Domain) < 1 {
			w.WriteHeader(404)
			w.Write([]byte("task not found"))
			return
		}
		jsonData, err := json.Marshal(task)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	})

	mux.HandleFunc("POST /api/task", func(w http.ResponseWriter, r *http.Request) {
		var input tasks.Task
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			w.WriteHeader(422)
			w.Write([]byte("unprocessable entry"))
			return
		}
		interval, err := time.ParseDuration(input.Interval)
		if err != nil {
			w.WriteHeader(422)
			w.Write([]byte(fmt.Sprintf("unprocessable entry: %v", err)))
			return
		}
		if len(input.Domain) < 1 {
			w.WriteHeader(400)
			w.Write([]byte("incorrect domain"))
			return
		}
		tasks.S.RemoveByTags(input.Domain)
		tasks.S.NewJob(
			gocron.DurationJob(interval),
			gocron.NewTask(
				func() {
					ip, err := duckdns.GetGlobalIP()
					if err != nil {
						slog.Error(err.Error(), "domain", input.Domain, "interval", interval)
						return
					}
					err = duckdns.UpdateDnsEntry(configs.TOKEN, ip, input.Domain)
					if err != nil {
						slog.Error(err.Error(), "domain", input.Domain, "interval", interval)
						return
					}
				},
			),
			gocron.WithTags(input.Domain),
			gocron.WithName(input.Interval),
		)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("DELETE /api/task/{domain}", func(w http.ResponseWriter, r *http.Request) {
		domain := r.PathValue("domain")
		tasks.S.RemoveByTags(domain)
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("GET /api/all-tasks", func(w http.ResponseWriter, r *http.Request) {
		allTasks := make([]tasks.Task, len(tasks.S.Jobs()))
		for i, j := range tasks.S.Jobs() {
			allTasks[i] = tasks.Task{
				Domain:   j.Tags()[0],
				Interval: j.Name(),
			}
		}
		jsonData, err := json.Marshal(allTasks)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	})

	mux.HandleFunc("DELETE /api/all-tasks", func(w http.ResponseWriter, r *http.Request) {
		if err := tasks.S.Shutdown(); err != nil {
			w.WriteHeader(500)
			w.Write([]byte("failed to restart scheduler"))
			return
		}
		if err := tasks.InitScheduler(); err != nil {
			w.WriteHeader(500)
			w.Write([]byte("failed to reinit scheduler"))
			return
		}
		tasks.S.Start()
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	})
	return mux
}

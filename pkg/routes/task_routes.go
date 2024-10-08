package routes

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/buckets/logbucket"
	"duckdns-ui/pkg/buckets/taskbucket"
	"duckdns-ui/pkg/db"
	"duckdns-ui/pkg/duckdns"
	"duckdns-ui/pkg/tasks"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"
	"time"

	"github.com/go-co-op/gocron/v2"
)

func AddTaskRoutes(mux *http.ServeMux) *http.ServeMux {

	mux.HandleFunc(
		"GET /api/task/{domain}",
		func(w http.ResponseWriter, r *http.Request) {
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
		},
	)

	mux.HandleFunc(
		"POST /api/task",
		func(w http.ResponseWriter, r *http.Request) {
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
			if interval == 0 {
				duckdns.UpdateDomain(input.Domain, interval)
				w.Write([]byte("ok"))
				return
			}
			if interval.Minutes() < 1 && !configs.DRY_RUN {
				w.WriteHeader(400)
				w.Write([]byte("interval too short"))
				return
			}
			tasks.S.RemoveByTags(input.Domain)
			tasks.S.NewJob(
				gocron.DurationJob(interval),
				gocron.NewTask(
					duckdns.UpdateDomain, input.Domain, interval,
				),
				gocron.WithTags(input.Domain),
				gocron.WithName(input.Interval),
			)
			t := taskbucket.DbTask{
				Domain:    input.Domain,
				Interval:  input.Interval,
				CreatedAt: time.Now().String(),
			}
			t.Save(db.DB)
			w.Write([]byte("ok"))
		},
	)

	mux.HandleFunc(
		"DELETE /api/task/{domain}",
		func(w http.ResponseWriter, r *http.Request) {
			domain := r.PathValue("domain")
			tasks.S.RemoveByTags(domain)
			taskbucket.DeleteTask(db.DB, domain)
			w.WriteHeader(200)
			w.Write([]byte("ok"))
		},
	)

	mux.HandleFunc(
		"GET /api/all-tasks",
		func(w http.ResponseWriter, r *http.Request) {
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
		},
	)

	mux.HandleFunc(
		"DELETE /api/all-tasks",
		func(w http.ResponseWriter, r *http.Request) {
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
			taskbucket.DeleteAllTasks(db.DB)
			w.WriteHeader(200)
			w.Write([]byte("ok"))
		},
	)

	mux.HandleFunc(
		"GET /api/task/logs/{domain}",
		func(w http.ResponseWriter, r *http.Request) {
			domain := r.PathValue("domain")
			logs, err := logbucket.GetTaskLogs(db.DB, domain)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			jsonData, err := json.Marshal(logs)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonData)
		},
	)

	mux.HandleFunc(
		"DELETE /api/task/logs/{domain}",
		func(w http.ResponseWriter, r *http.Request) {
			domain := r.PathValue("domain")
			logbucket.DeleteTaskLogs(db.DB, domain)
			w.WriteHeader(200)
			w.Write([]byte("ok"))
		},
	)

	return mux
}

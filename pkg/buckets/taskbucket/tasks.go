package taskbucket

import (
	"duckdns-ui/pkg/duckdns"
	"duckdns-ui/pkg/tasks"
	"encoding/json"
	"log/slog"
	"time"

	"github.com/go-co-op/gocron/v2"
	"go.etcd.io/bbolt"
	bolt "go.etcd.io/bbolt"
)

const TasksBucket string = "tasksBucket"

type DbTask struct {
	Domain    string `json:"domain"`
	Interval  string `json:"interval"`
	CreatedAt string `json:"created-at"`
}

func (t *DbTask) Save(db *bolt.DB) error {
	// Store the user model in the user bucket using the username as the key.
	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(TasksBucket))
		if err != nil {
			return err
		}
		encoded, err := json.Marshal(t)
		if err != nil {
			return err
		}
		return b.Put([]byte(t.Domain), encoded)
	})
	return err
}

func DeleteTask(db *bolt.DB, domain string) error {
	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(TasksBucket))
		return b.Delete([]byte(domain))
	})
	if err != nil {
		return err
	}
	return nil
}

func RestoreTask(task DbTask) error {
	interval, _ := time.ParseDuration(task.Interval)
	tasks.S.RemoveByTags(task.Domain)
	tasks.S.NewJob(
		gocron.DurationJob(interval),
		gocron.NewTask(
			duckdns.UpdateDomain, task.Domain, interval,
		),
		gocron.WithTags(task.Domain),
		gocron.WithName(task.Interval),
	)
	slog.Info("Task restored", "domain", task.Domain, "interval", task.Interval)
	return nil
}

func ResotreAllTasks(db *bolt.DB) error {
	restoredTasks := 0
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(TasksBucket))
		if b == nil {
			return nil
		}
		b.ForEach(func(k, v []byte) error {
			var taskData DbTask
			if err := json.Unmarshal([]byte(v), &taskData); err != nil {
				return err
			}
			RestoreTask(taskData)
			restoredTasks++
			return nil
		})
		return nil
	})
	if err != nil {
		return err
	}
	slog.Info("All tasks restored", "count", restoredTasks)
	return nil

}

func DeleteAllTasks(db *bolt.DB) error {
	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(TasksBucket))
		return b.ForEach(func(k, v []byte) error {
			return b.Delete(k)
		})
	})
	if err != nil {
		return err
	}
	slog.Info("All tasks deleted")
	return nil
}

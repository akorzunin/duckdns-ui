package tasks

import (
	"github.com/go-co-op/gocron/v2"
)

var S gocron.Scheduler

type Task struct {
	Domain   string `json:"domain"`
	Interval string `json:"interval"`
}

func InitScheduler() error {
	s, err := gocron.NewScheduler()
	if err != nil {
		return err
	}
	S = s
	return nil
}

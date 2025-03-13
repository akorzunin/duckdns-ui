package tasks_test

import (
	"duckdns-ui/pkg/tasks"
	"testing"
)

func TestInitScheduler(t *testing.T) {
	err := tasks.InitScheduler()
	if err != nil {
		t.Fatalf("failed to init task scheduler: %v", err)
	}
	if tasks.S == nil {
		t.Fatalf("scheduler is nil")
	}
}

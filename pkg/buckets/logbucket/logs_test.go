package logbucket_test

import (
	"duckdns-ui/pkg/buckets/logbucket"
	"duckdns-ui/pkg/db"
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func SetupTest(t *testing.T) {
	_ = db.InitializeDB("../../../data/test-logs-data.db")
	t.Cleanup(func() {
		_ = logbucket.DeleteTaskLogs(db.DB, "test.domain")
		_ = db.DB.Close()
	})
	for i := range 20 {
		l := &logbucket.DbTaskLog{
			Domain:    "test.domain",
			Interval:  "10s",
			IP:        fmt.Sprintf("127.0.0.%d", i+1),
			Message:   "",
			Timestamp: time.Now(),
		}
		l.SaveWithMessage(db.DB, "task succeeded")
	}
}

func TestGetTaskLogs(t *testing.T) {
	SetupTest(t)
	logs, err := logbucket.GetTaskLogs(db.DB, "test.domain", 10, 0)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, len(logs), 10, "wrong number of logs")
	assert.Equal(t, logs[0].IP, "127.0.0.20", "wrong ip")
	assert.Equal(t, logs[len(logs)-1].IP, "127.0.0.11", "wrong ip")
}

func TestGetTaskLogsWithOffset(t *testing.T) {
	SetupTest(t)
	logs, err := logbucket.GetTaskLogs(db.DB, "test.domain", 10, 5)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, len(logs), 10, "wrong number of logs")
	assert.Equal(t, logs[0].IP, "127.0.0.15", "wrong ip")
	assert.Equal(t, logs[len(logs)-1].IP, "127.0.0.6", "wrong ip")
}

func TestGetTaskLogsOverLimit(t *testing.T) {
	SetupTest(t)
	logs, err := logbucket.GetTaskLogs(db.DB, "test.domain", 100, 0)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, len(logs), 20, "wrong number of logs")
	assert.Equal(t, logs[0].IP, "127.0.0.20", "wrong ip")
	assert.Equal(t, logs[len(logs)-1].IP, "127.0.0.1", "wrong ip")
}

func TestGetTaskLogsOffsetOverLimit(t *testing.T) {
	SetupTest(t)
	logs, err := logbucket.GetTaskLogs(db.DB, "test.domain", 100, 5)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, len(logs), 20-5, "wrong number of logs")
	assert.Equal(t, logs[0].IP, "127.0.0.15", "wrong ip")
	assert.Equal(t, logs[len(logs)-1].IP, "127.0.0.1", "wrong ip")
}

package logbucket

import (
	"encoding/json"
	"time"

	bolt "go.etcd.io/bbolt"
)

const LogsBucket string = "logsBucket"

type DbTaskLog struct {
	Domain    string    `json:"domain"`
	Interval  string    `json:"interval"`
	IP        string    `json:"ip"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timstamp"`
}

func (l *DbTaskLog) Save(db *bolt.DB) error {
	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(LogsBucket))
		if err != nil {
			return err
		}
		domainLogsBucket, err := b.CreateBucketIfNotExists([]byte(l.Domain))
		if err != nil {
			return err
		}
		encoded, err := json.Marshal(l)
		if err != nil {
			return err
		}
		return domainLogsBucket.Put([]byte(l.Timestamp.String()), encoded)
	})
	return err
}

func GetTaskLogs(db *bolt.DB, domain string) ([]*DbTaskLog, error) {
	var taskLogs []*DbTaskLog
	err := db.View(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(LogsBucket))
		if err != nil {
			return err
		}
		domainLogs, err := b.CreateBucketIfNotExists([]byte(domain))
		domainLogs.ForEach(func(k, v []byte) error {
			var logData *DbTaskLog
			err = json.Unmarshal(v, logData)
			if err != nil {
				return err
			}
			taskLogs = append(taskLogs, logData)
			return err
		})
		return nil
	})
	if err != nil {
		return nil, err
	}
	return taskLogs, nil
}

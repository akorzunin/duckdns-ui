package logbucket

import (
	"encoding/json"
	"errors"
	"time"

	bolt "go.etcd.io/bbolt"
)

const LogsBucket string = "logsBucket"

type DbTaskLog struct {
	Domain    string    `json:"domain"`
	Interval  string    `json:"interval"`
	IP        string    `json:"ip"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
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

func (l *DbTaskLog) SaveWithMessage(db *bolt.DB, message string) error {
	l.Message = message
	return l.Save(db)
}

func GetTaskLogs(
	db *bolt.DB,
	domain string,
	limit int,
	offset int,
) ([]*DbTaskLog, error) {
	var taskLogs []*DbTaskLog

	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(LogsBucket))
		if b == nil {
			return errors.New("logs bucket not found")
		}
		domainLogs := b.Bucket([]byte(domain))
		if domainLogs == nil {
			return errors.New("domain logs not found")
		}
		s := domainLogs.Stats()
		if s.KeyN == 0 {
			return nil
		}
		c := domainLogs.Cursor()
		count := 0
		for _, v := c.Last(); count < (limit + offset); _, v = c.Prev() {
			if count < offset || v == nil {
				count++
				continue
			}
			var logData DbTaskLog
			err := json.Unmarshal(v, &logData)
			if err != nil {
				return err
			}
			taskLogs = append(taskLogs, &logData)
			count++
		}
		return nil
	})

	return taskLogs, err
}

func DeleteTaskLogs(db *bolt.DB, domain string) error {
	return db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(LogsBucket))
		if err != nil {
			return err
		}
		domainLogs, err := b.CreateBucketIfNotExists([]byte(domain))
		if err != nil {
			return err
		}
		return domainLogs.ForEach(func(k, v []byte) error {
			return domainLogs.Delete(k)
		})
	})
}

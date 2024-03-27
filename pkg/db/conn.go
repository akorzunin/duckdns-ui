package db

import (
	"duckdns-ui/pkg/buckets/domainbucket"

	"go.etcd.io/bbolt"
)

var DB *bbolt.DB

// InitializeDB initializes the BoltDB instance.
func InitializeDB(filepath string) error {
	var err error
	DB, err = bbolt.Open(filepath, 0600, nil)
	if err != nil {
		return err
	}
	DB.Update(func(tx *bbolt.Tx) error {
		tx.CreateBucketIfNotExists([]byte(domainbucket.DomainsBucket))
		return nil
	})
	return nil

}

func View(fn func(*bbolt.Tx) error) error {
	return DB.View(fn)
}

func Update(fn func(*bbolt.Tx) error) error {
	return DB.Update(fn)
}

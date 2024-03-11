package db

import (
	"encoding/json"

	bolt "go.etcd.io/bbolt"
)

const DomainsBucket string = "domainsBucket"

type Domain struct {
	Name string `json:"name"`
	IP   string `json:"ip"`
}

func (d *Domain) Save(db *bolt.DB) error {
	// Store the user model in the user bucket using the username as the key.
	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(DomainsBucket))
		if err != nil {
			return err
		}
		encoded, err := json.Marshal(d)
		if err != nil {
			return err
		}
		return b.Put([]byte(d.Name), encoded)
	})
	return err
}

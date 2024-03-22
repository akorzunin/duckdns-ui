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

func UpdateDomainEntry(db *bolt.DB, name string, ip string) error {
	err := db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(DomainsBucket))
		encoded, err := json.Marshal(Domain{Name: name, IP: ip})
		if err != nil {
			return err
		}
		return b.Put([]byte(name), encoded)
	})
	return err
}

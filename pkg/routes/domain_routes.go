package routes

import (
	"duckdns-ui/pkg/buckets"
	"duckdns-ui/pkg/db"
	"duckdns-ui/pkg/tasks"
	"encoding/json"
	"net/http"

	"go.etcd.io/bbolt"
)

func AddDomainRoutes(mux *http.ServeMux) *http.ServeMux {
	mux.HandleFunc("POST /api/domain", func(w http.ResponseWriter, r *http.Request) {
		var input db.Domain
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			w.WriteHeader(422)
			w.Write([]byte("unprocessable entry"))
			return
		}
		if len(input.Name) < 1 {
			w.WriteHeader(400)
			w.Write([]byte("incorrect domain"))
			return
		}
		conn := db.DB
		if err := input.Save(conn); err != nil {
			w.WriteHeader(400)
			w.Write([]byte("write to db failed"))
			return
		}
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("GET /api/domain/{domain}", func(w http.ResponseWriter, r *http.Request) {
		domain := r.PathValue("domain")
		conn := db.DB
		var data []byte
		err := conn.View(func(tx *bbolt.Tx) error {
			b := tx.Bucket([]byte(db.DomainsBucket))
			data = b.Get([]byte(domain))
			return nil
		})
		if err != nil {
			w.WriteHeader(400)
			w.Write([]byte("read from db failed"))
		}
		if len(data) < 1 {
			w.WriteHeader(404)
			w.Write([]byte("domain not found"))
			return
		}
		w.Write(data)
	})

	mux.HandleFunc("GET /api/all-domains", func(w http.ResponseWriter, r *http.Request) {
		conn := db.DB
		var data []db.Domain
		err := conn.View(func(tx *bbolt.Tx) error {
			b := tx.Bucket([]byte(db.DomainsBucket))
			b.ForEach(func(k, v []byte) error {
				var domainData db.Domain
				if err := json.Unmarshal([]byte(v), &domainData); err != nil {
					return err
				}
				data = append(data, domainData)
				return nil
			})
			return nil
		})
		if err != nil {
			w.WriteHeader(400)
			w.Write([]byte("read from db failed"))
		}

		jsonData, err := json.Marshal(data)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	})

	mux.HandleFunc("DELETE /api/domain/{domain}", func(w http.ResponseWriter, r *http.Request) {
		domain := r.PathValue("domain")
		conn := db.DB
		err := conn.Update(func(tx *bbolt.Tx) error {
			b := tx.Bucket([]byte(db.DomainsBucket))
			return b.Delete([]byte(domain))
		})
		if err != nil {
			w.WriteHeader(400)
			w.Write([]byte("delete from db failed"))
			return
		}
		tasks.S.RemoveByTags(domain)
		buckets.DeleteTask(conn, domain)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("DELETE /api/all-domains", func(w http.ResponseWriter, r *http.Request) {
		conn := db.DB
		err := conn.Update(func(tx *bbolt.Tx) error {
			if err := tx.DeleteBucket([]byte(db.DomainsBucket)); err != nil {
				return err
			}
			_, err := tx.CreateBucketIfNotExists([]byte(db.DomainsBucket))
			return err
		})
		if err != nil {
			w.WriteHeader(400)
			w.Write([]byte("delete from db failed"))
		}
		w.Write([]byte("ok"))
	})

	return mux
}

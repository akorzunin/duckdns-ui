package duckdns

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/db"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math/rand/v2"
	"net/http"
	"time"
)

func UpdateDnsEntry(token string, ip string, domain string) error {
	url := fmt.Sprintf(
		"https://duckdns.org/update/?token=%s&ip=%s&domains=%s",
		token,
		ip,
		domain,
	)
	if configs.DRY_RUN {
		slog.Info("DRY_RUN", "url", url)
		return nil
	}
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	body, err := io.ReadAll(io.Reader(res.Body))
	if err != nil {
		return err
	}
	res.Body.Close()
	if r := string(body); r == "OK" {
		slog.Info("domain updated", "domain", domain, "ip", ip)
		return nil
	}
	return errors.New("failed to update domain")

}

func GetGlobalIP() (string, error) {
	url := "http://ifconfig.me/"
	if configs.DRY_RUN {
		dummyIp := fmt.Sprintf("127.0.0.%d", rand.IntN(256-0)+0)
		return dummyIp, nil
	}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status code: %d", res.StatusCode)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func UpdateDomain(domain string, interval time.Duration) {
	ip, err := GetGlobalIP()
	if err != nil {
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
	err = UpdateDnsEntry(configs.TOKEN, ip, domain)
	if err != nil {
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
	err = db.UpdateDomainEntry(db.DB, domain, ip)
	if err != nil {
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
}

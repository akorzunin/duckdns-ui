package duckdns

import (
	"duckdns-ui/configs"
	"duckdns-ui/pkg/buckets/domainbucket"
	"duckdns-ui/pkg/buckets/logbucket"
	"duckdns-ui/pkg/db"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math/rand/v2"
	"net/http"
	"time"
)

func UpdateDnsEntry(token string, domain string, ip string) error {
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
	req.Header.Set("User-Agent", "curl")
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
	l := &logbucket.DbTaskLog{
		Domain:    domain,
		Interval:  interval.String(),
		IP:        "",
		Message:   "",
		Timestamp: time.Now(),
	}
	ip, err := GetGlobalIP()
	if err != nil {
		l.SaveWithMessage(db.DB, "failed to get ip: "+err.Error())
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
	l.IP = ip
	err = UpdateDnsEntry(configs.TOKEN, domain, ip)
	if err != nil {
		l.SaveWithMessage(db.DB, "failed to update domain: "+err.Error())
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
	err = domainbucket.UpdateDomainEntry(db.DB, domain, ip)
	if err != nil {
		l.SaveWithMessage(db.DB, "failed to update domain entry: "+err.Error())
		slog.Error(err.Error(), "domain", domain, "interval", interval)
		return
	}
	l.SaveWithMessage(db.DB, "task succeeded")
	slog.Info("task succeeded", "domain", domain, "ip", ip)

}

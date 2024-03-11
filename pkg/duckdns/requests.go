package duckdns

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

func UpdateDnsEntry(token string, ip string, domain string) error {

	url := fmt.Sprintf(
		"https://duckdns.org/update/?token=%s&ip=%s&domains=%s",
		token,
		ip,
		domain,
	)

	req, _ := http.NewRequest("POST", url, nil)
	res, _ := http.DefaultClient.Do(req)
	body, _ := io.ReadAll(io.Reader(res.Body))
	res.Body.Close()
	r := string(body)
	if r == "OK" {
		return nil
	}
	return errors.New("failed to update domain")

}

func GetGlobalIP() (string, error) {
	return "127.0.0.1", nil
	// url := "http://ifconfig.me/"
	//
	// req, err := http.NewRequest("GET", url, nil)
	// if err != nil {
	// 	return "", err
	// }
	// res, err := http.DefaultClient.Do(req)
	// if err != nil {
	// 	return "", err
	// }
	// defer res.Body.Close()
	// if res.StatusCode != http.StatusOK {
	// 	return "", fmt.Errorf("unexpected status code: %d", res.StatusCode)
	// }
	// body, err := io.ReadAll(res.Body)
	// if err != nil {
	// 	return "", err
	// }
	// return string(body), nil
}

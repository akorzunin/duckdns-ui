package duckdns

import (
	"duckdns-ui/configs"
	"strings"
	"testing"
)

func init() {
	configs.DRY_RUN = true
}

func TestUpdateDnsEntry(t *testing.T) {
	err := UpdateDnsEntry("token", "domain", "127.0.0.1")
	if err != nil {
		t.Errorf("UpdateDnsEntry() error = %v, wantErr false", err)
	}
}

func TestGetGlobalIP(t *testing.T) {
	ip, err := GetGlobalIP()
	if err != nil {
		t.Errorf("GetGlobalIP() error = %v, wantErr false", err)
	}
	if !strings.HasPrefix(ip, "127.0.0.") {
		t.Errorf("GetGlobalIP() = %v, want %v", ip, "127.0.0.*")
	}
}

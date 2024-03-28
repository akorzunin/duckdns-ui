package tasks

import "testing"

func TestInitScheduler(t *testing.T) {
	err := InitScheduler()
	if err != nil {
		t.Errorf(err.Error())
	}
	if S == nil {
		t.Errorf("failed to init task scheduler")
	}
}

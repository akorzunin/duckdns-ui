package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var _ int = func() int {
	if err := godotenv.Load(".env"); err != nil {
		return 1
	}
	return 1
}()

var LOG_JSON bool = func() bool {
	LOG_JSON := os.Getenv("LOG_JSON")
	if LOG_JSON == "true" || LOG_JSON == "1" {
		return true
	}
	return false
}()

var DRY_RUN bool = func() bool {
	DRY_RUN := os.Getenv("DRY_RUN")
	if DRY_RUN == "true" || DRY_RUN == "1" {
		return true
	}
	return false
}()

var TOKEN string = func() string {
	TOKEN := os.Getenv("TOKEN")
	if TOKEN == "" && !DRY_RUN {
		log.Fatal("Error loading TOKEN env variable")
	}
	return TOKEN
}()

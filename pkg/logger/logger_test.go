package logger

import (
	"bytes"
	"duckdns-ui/configs"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestSetupLogger(t *testing.T) {
	// Redirect stdout to a buffer to capture the logger's output.
	oldStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	// Call SetupLogger to configure the logger.
	SetupLogger()

	// Write a log message to verify the logger's output format.
	slog.Info("test message")

	// Close the pipe and restore stdout.
	w.Close()
	os.Stdout = oldStdout

	// Read the captured output.
	var buf bytes.Buffer
	buf.ReadFrom(r)
	output := buf.String()

	// Check if the output is in the expected format (JSON or text).
	if configs.LOG_JSON {
		// Check if the output is in JSON format.
		if !(output[0] == '{' && output[len(output)-1] == '}') {
			t.Errorf("Expected JSON format, got: %s", output)
		}
	} else {
		// Check if the output is in text format.
		if output[0] == '{' || output[len(output)-1] == '}' {
			t.Errorf("Expected text format, got: %s", output)
		}
	}
}

func TestLoggingMiddleware(t *testing.T) {
	// Create a request to pass to our handler.
	req, err := http.NewRequest("GET", "/test", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()

	// Create a handler to test.
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Wrap the handler with the logging middleware.
	middlewareHandler := LogginngMiddleware(handler)

	// Call the middleware handler.
	middlewareHandler.ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf(
			"handler returned wrong status code: got %v want %v",
			status,
			http.StatusOK,
		)
	}

	// Check the response body is what we expect.
	expected := "OK"
	if rr.Body.String() != expected {
		t.Errorf(
			"handler returned unexpected body: got %v want %v",
			rr.Body.String(),
			expected,
		)
	}
}

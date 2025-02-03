package main

import (
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

// ObjectNotificationReq is the parent object for object notification events.
type ObjectNotificationReq struct {
	Events []*ObjectNotificationEvent `json:"events"`
}

// ObjectNotificationEvent contains information about an object being created or deleted.
type ObjectNotificationEvent struct {
	EventVersion string       `json:"eventVersion"`
	EventSource  string       `json:"eventSource"`
	EventName    string       `json:"eventName"`
	EventTime    string       `json:"eventTime"`
	Bucket       string       `json:"bucket"`
	Object       *EventObject `json:"object"`
}

// EventObject contains the most important information about an object.
type EventObject struct {
	Key  string `json:"key"`
	Size int32  `json:"size"`
	ETag string `json:"eTag"`
}

// eventReciever is a simple http handler that receives object notification events.
//
// This does not do any validation or authentication on any incoming requests.
func eventReceiver(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	var req ObjectNotificationReq
	err = json.Unmarshal(body, &req)
	if err != nil {
		http.Error(w, "Error unmarshalling request body", http.StatusInternalServerError)
		return
	}

	fmt.Println("Events:")
	for _, event := range req.Events {
		fmt.Printf("time: %v, event: %v, bucket: %v, key: %v\n", event.EventTime, event.EventName, event.Bucket, event.Object.Key)
	}

	fmt.Fprint(w, "ok")
}

// basicAuth is a HTTP middleware that checks for basic auth credentials in incoming requests against a static username and password.
//
// Usage:
//
//	http.HandleFunc("/basic-auth", basicAuth("user", "pass", eventReceiver))
func basicAuth(username, password string, next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, pass, ok := r.BasicAuth()
		if !ok {
			w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if subtle.ConstantTimeCompare([]byte(user), []byte(username)) != 1 || subtle.ConstantTimeCompare([]byte(pass), []byte(password)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// tokenAuth is an HTTP middleware that checks if incoming requests have an API token matching a statically defined value.
//
// Usage:
//
//	http.HandleFunc("/token-auth", tokenAuth("secret-token-pass", eventReceiver))
func tokenAuth(token string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") || subtle.ConstantTimeCompare([]byte(strings.TrimPrefix(auth, "Bearer ")), []byte(token)) != 1 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		fmt.Println("token auth successful")

		next.ServeHTTP(w, r)
	})
}

func main() {
	http.HandleFunc("/no-auth", eventReceiver)
	http.Handle("/basic-auth", basicAuth("user", "pass", eventReceiver))
	http.Handle("/token-auth", tokenAuth("secret-token-pass", eventReceiver))

	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func securityMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")

		w.Header().Set("Access-Control-Allow-Origin", "https://szymoncz.github.io")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func main() {
	http.HandleFunc("/health", securityMiddleware(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, `{"status": "ok"}`)
	}))

	fmt.Println("Server działa na :8000")
	http.ListenAndServe(":8000", nil)
}

package utils

import (
	"log"
	"net/http"
	"time"
)

type writerWrapper struct {
	writer http.ResponseWriter
	code   int
}

func (w *writerWrapper) Header() http.Header {
	return w.writer.Header()
}
func (w *writerWrapper) WriteHeader(arg int) {
	w.code = arg
	w.writer.WriteHeader(arg)
}
func (w *writerWrapper) Write(arg []byte) (int, error) {
	return w.writer.Write(arg)
}

func HttpLogger(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t0 := time.Now()

		wrapped := &writerWrapper{w, http.StatusOK}

		next.ServeHTTP(wrapped, r)
		log.Printf("%v : %v [%v ms] %v \n", r.Method, r.URL.Path, time.Since(t0).Milliseconds(), wrapped.code)
	}
}

func HttpLoggerFunc(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t0 := time.Now()

		wrapped := &writerWrapper{w, http.StatusOK}

		next(wrapped, r)
		log.Printf("%v : %v [%v ms] %v \n", r.Method, r.URL.Path, time.Since(t0).Milliseconds(), wrapped.code)
	}
}

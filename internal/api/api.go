package api

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

type EntryPoint struct {
	Token     string
	URL       string
	ServeHTTP http.HandlerFunc
}

func NewEntryPoint(data []byte) (*EntryPoint, error) {

	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	id := uuid.New()
	token := uuid.New()

	ep := &EntryPoint{
		Token: token.String(),
		URL:   fmt.Sprintf("/api/%v", url.QueryEscape(id.String())),
		ServeHTTP: func(w http.ResponseWriter, r *http.Request) {
			requestToken := r.Header.Get("Authorization")

			if requestToken != token.String() {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			w.Write(data)

		},
	}

	return ep, nil
}

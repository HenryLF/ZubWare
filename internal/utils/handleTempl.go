package utils

import (
	"log"
	"net/http"

	"github.com/a-h/templ"
)

func HandleTempl(x func() templ.Component) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := x().Render(r.Context(), w)
		if err != nil {
			log.Println(err)
		}
	}
}

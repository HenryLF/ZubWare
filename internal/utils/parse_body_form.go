package utils

import (
	"encoding/json"
	"net/http"
)

func ParseBodyForm(r *http.Request, v any) error {
	r.ParseForm()
	jsonData := r.PostForm.Get("json")
	return json.Unmarshal([]byte(jsonData), v)

}

package handles

import (
	"net/http"
	"zubware/components/todos"
	"zubware/internal/utils"

	"github.com/google/uuid"
)

type newTodoPayload struct {
	Type string        `json:"type"`
	Id   uuid.NullUUID `json:"id"`
}

func Todos(w http.ResponseWriter, r *http.Request) {
	data := newTodoPayload{}
	utils.ParseBodyForm(r, &data)
	switch data.Type {
	case "text":
		todos.TextToDo(data.Id).Render(r.Context(), w)
	case "image":
		todos.ImageToDo(data.Id).Render(r.Context(), w)
	case "checklist":
		todos.CheckListToDo(data.Id).Render(r.Context(), w)
	}

}

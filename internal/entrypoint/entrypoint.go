package entrypoint

import (
	"errors"
	"net/http"
	"sync"
	"time"
	"zubware/internal/api"
)

const (
	ENTRYPOINT_LIFETIME = 5 * time.Minute
	MAX_ENTRY_POINT     = 10_000
)

type entryPointPool struct {
	pool map[string]*api.EntryPoint
	mu   *sync.Mutex
}

func (e *entryPointPool) add(ep *api.EntryPoint) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	if len(e.pool) > MAX_ENTRY_POINT {
		return errors.New("entry points : maximum capacity reached")
	}
	e.pool[ep.URL] = ep
	return nil
}
func (e *entryPointPool) remove(ep *api.EntryPoint) {
	e.mu.Lock()
	defer e.mu.Unlock()
	delete(e.pool, ep.URL)
}
func (e *entryPointPool) getHandle(url string) http.HandlerFunc {
	e.mu.Lock()
	defer e.mu.Unlock()
	if _, ok := e.pool[url]; !ok {
		return func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
		}
	}
	return e.pool[url].ServeHTTP
}

var activeEntryPoint = entryPointPool{pool: map[string]*api.EntryPoint{}, mu: new(sync.Mutex)}

func NewEntryPoint(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	err := r.ParseForm()
	if err != nil {
		EntryPointError(err.Error()).Render(r.Context(), w)
		return
	}

	data := r.PostForm.Get("json")

	ep, err := api.NewEntryPoint([]byte(data))
	if err != nil {
		EntryPointError(err.Error()).Render(r.Context(), w)
		return
	}

	err = activeEntryPoint.add(ep)
	if err != nil {
		EntryPointError(err.Error()).Render(r.Context(), w)
		return
	}
	go func() {
		time.Sleep(ENTRYPOINT_LIFETIME)
		activeEntryPoint.remove(ep)
	}()

	EntryPointTempl(ep.Token, ep.URL).Render(r.Context(), w)

}

func ServeEntryPoint(w http.ResponseWriter, r *http.Request) {
	activeEntryPoint.getHandle(r.URL.Path)(w, r)
}

FROM golang:1.24.3

WORKDIR /app


COPY go.mod go.sum ./

RUN go mod download

COPY . .



RUN  go build -o /build ./

EXPOSE 8080


CMD ["ls  && . build"]
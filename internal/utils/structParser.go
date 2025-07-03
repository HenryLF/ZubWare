package utils

import "github.com/mitchellh/mapstructure"

var config = mapstructure.DecoderConfig{
	TagName: "json",
}

func ParseStruct(data any, target any) error {
	config.Result = target
	decoder, err := mapstructure.NewDecoder(&config)
	if err != nil {
		return err
	}
	return decoder.Decode(data)
}

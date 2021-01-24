package config

import (
	"io/ioutil"

	yaml "gopkg.in/yaml.v3"
)

type Config struct {
	Port          string `yaml:"port"`
	DatabaseURL   string `yaml:"database_url"`
	ExtensionPath string `yaml:"extension_path"`
}

func Load(path string) (*Config, error) {
	f, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var config Config
	err = yaml.Unmarshal(f, &config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}

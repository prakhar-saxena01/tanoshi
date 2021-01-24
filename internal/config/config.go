package config

import (
	"io/ioutil"
	"os"

	yaml "gopkg.in/yaml.v3"
)

type Config struct {
	path          string                 `yaml:"-"`
	Port          string                 `yaml:"port"`
	DatabaseURL   string                 `yaml:"database_url"`
	ExtensionPath string                 `yaml:"extension_path"`
	Password      string                 `yaml:"password"`
	SourceConfig  map[string]interface{} `yaml:"source_config"`
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

	config.path = path
	return &config, nil
}

func (c *Config) Save() error {
	data, err := yaml.Marshal(c)
	if err != nil {
		return err
	}
	f, _ := os.Create(c.path)
	defer f.Close()

	_, err = f.Write(data)
	return err
}

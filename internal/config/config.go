package config

import (
	"io/ioutil"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	yaml "gopkg.in/yaml.v3"
)

type Config struct {
	path         string `yaml:"-"`
	Port         string `yaml:"port"`
	DatabaseURL  string `yaml:"database_url"`
	ExtensionURL string `yaml:"extension_url"`
}

func defaultConfig(path string) Config {
	rand.Seed(time.Now().UnixNano())

	return Config{
		Port:        "80",
		DatabaseURL: "sqlite://" + filepath.Dir(path) + "/tanoshi.db",
	}
}

func Load(path string) (Config, error) {
	f, err := ioutil.ReadFile(path)
	if err != nil {
		cfg := defaultConfig(path)
		cfg.Save()
	}

	var config Config
	err = yaml.Unmarshal(f, &config)
	if err != nil {
		return config, err
	}

	config.path = path
	return config, nil
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

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
	Password     string `yaml:"password"`
	ExtensionURL string `yaml:"extension_url"`
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randSeq(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func defaultConfig(path string) *Config {
	rand.Seed(time.Now().UnixNano())

	return &Config{
		Port:        "80",
		DatabaseURL: "sqlite://" + filepath.Dir(path) + "/kumo.db",
		Password:    randSeq(32),
	}
}

func Load(path string) (*Config, error) {
	f, err := ioutil.ReadFile(path)
	if err != nil {
		cfg := defaultConfig(path)
		cfg.Save()
	}

	var config Config
	err = yaml.Unmarshal(f, &config)
	if err != nil {
		return nil, err
	}
	if config.Password == "" {
		config.Password = randSeq(32)
		config.Save()
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

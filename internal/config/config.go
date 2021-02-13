package config

import (
	"io/ioutil"
	"os"
	"path"

	yaml "gopkg.in/yaml.v3"
)

type Config struct {
	path         string `yaml:"-"`
	Port         string `yaml:"port"`
	DatabaseURL  string `yaml:"database_url"`
	ExtensionURL string `yaml:"extension_url"`
	LocalDir     string `yaml:"local_dir"`
}

func defaultConfig() Config {
	homeDir, _ := os.UserHomeDir()
	localDir := path.Join(homeDir, ".config/tanoshi/manga")
	dbPath := path.Join(homeDir, ".config/tanoshi/tanoshi.db")

	os.MkdirAll(localDir, 0644)

	return Config{
		Port:         "80",
		DatabaseURL:  "sqlite://" + dbPath,
		ExtensionURL: "https://faldez.github.io/tanoshi-extensions/",
		LocalDir:     localDir,
	}
}

func Load(path string) (Config, error) {
	f, err := ioutil.ReadFile(path)
	if err != nil {
		cfg := defaultConfig()
		cfg.path = path
		cfg.Save()
		return cfg, nil
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

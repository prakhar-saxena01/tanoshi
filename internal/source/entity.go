package source

import (
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	lua "github.com/yuin/gopher-lua"
	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

type Config struct {
	path   string      `yaml:"-"`
	Header http.Header `yaml:"header"`
}

func LoadConfig(path string) *Config {
	path = strings.TrimRight(path, ".lua") + ".yml"

	cfg := Config{
		path:   path,
		Header: make(http.Header),
	}
	f, err := ioutil.ReadFile(path)
	if err != nil {
		return &cfg
	}

	yaml.Unmarshal(f, &cfg)
	return &cfg
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

type Manga struct {
	gorm.Model  `luar:"-"`
	Source      string `luar:"-" gorm:"index:source_url_idx,unique;check:,source <> ''"`
	Title       string `gorm:"check:,title <> ''"`
	Path        string `gorm:"index:source_url_idx,unique;check:,path <> ''"`
	Description string
	CoverURL    string `gorm:"check:,cover_url <> ''"`
	Authors     string
	Status      string
	Genres      string
	IsFavorite  bool `luar:"-"`
	Chapters    []Chapter
}

const luaMangaTypeName string = "Manga"

func (m *Manga) IsIncomplete() bool {
	if m.Description == "" || m.Status == "" ||
		m.Authors == "" || m.Genres == "" {
		return true
	}
	return false
}

type Chapter struct {
	gorm.Model   `luar:"-"`
	Source       string `luar:"-"`
	MangaID      uint
	Number       string
	Title        string
	Path         string
	Uploaded     time.Time
	ReadAt       *time.Time `luar:"-"`
	LastPageRead int        `luar:"-"`
	Pages        []*Page
}

const luaChapterTypeName = "Chapter"

type Page struct {
	gorm.Model `luar:"-"`
	ChapterID  uint `luar:"-"`
	Rank       int
	URL        string
}

const luaPageTypeName = "Page"

type SourceResponse struct {
	Header http.Header `luar:"-"`
	Body   string
}

type Filters map[string]string

func (f *Filters) ToLTable() *lua.LTable {
	if f == nil {
		return nil
	}
	tbl := &lua.LTable{}
	for k, v := range *f {
		tbl.RawSetString(k, lua.LString(v))
	}
	return tbl
}

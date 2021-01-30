package source

import (
	"database/sql/driver"

	jsoniter "github.com/json-iterator/go"

	"errors"
	"fmt"
	"net/http"
	"time"

	"gorm.io/gorm"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

type Config struct {
	Header   http.Header `json:",omitempty"`
	Language map[string]bool
}

// Scan scan value into Jsonb, implements sql.Scanner interface
func (c *Config) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New(fmt.Sprint("Failed to unmarshal json value:", value))
	}

	*c = Config{}
	err := json.Unmarshal(bytes, c)
	if err != nil {
		return err
	}
	if c.Header == nil {
		c.Header = make(http.Header)
	}
	if c.Language == nil {
		c.Language = make(map[string]bool)
	}
	return nil
}

// Value return json value, implement driver.Valuer interface
func (c Config) Value() (driver.Value, error) {
	return json.Marshal(c)
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
	Chapters    []Chapter
	IsFavorite  bool
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
	Path         string
	Number       string
	Title        string
	Language     string
	Rank         float64
	UploadedAt   time.Time
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

type Filter struct {
	Title string
	Page  int
}

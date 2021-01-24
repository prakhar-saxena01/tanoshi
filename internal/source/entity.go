package source

import (
	"net/http"
	"time"

	lua "github.com/yuin/gopher-lua"
	"gorm.io/gorm"
)

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

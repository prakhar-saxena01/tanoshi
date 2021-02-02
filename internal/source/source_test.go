package source_test

import (
	"io/ioutil"
	"net/http"
	"os"
	"testing"

	"github.com/faldez/tanoshi/internal/source"
)

var s *source.Source

func TestMain(m *testing.M) {
	s = &source.Source{
		Name:     "Mangadex",
		Contents: []byte{},
		Config: &source.Config{
			make(http.Header),
			make(map[string]bool),
		},
		Installed: false,
		Version:   "",
		URL:       "",
		Icon:      "",
		Update:    false,
	}
	var err error
	s.Contents, err = ioutil.ReadFile("/Users/fadhlika/Repos/tanoshi-extensions/source/mangadex/mangadex.lua")
	if err != nil {
		os.Exit(1)
	}

	err = s.Initialize()
	if err != nil {
		os.Exit(1)
	}

	os.Exit(m.Run())
}

func TestGetName(t *testing.T) {
}

func TestGetBaseURL(t *testing.T) {

}
func TestGetLanguageOptions(t *testing.T) {

}

func TestGetVersion(t *testing.T) {

}

func TestGetLatestUpdatesRequest(t *testing.T) {

}

// GetLatestUpdates get latest updates from source and return list of manga
func TestGetLatestUpdates(t *testing.T) {

}

// GetMangaDetails get details for a manga
func TestGetMangaDetails(t *testing.T) {
}

// GetChapters get list of chapter of a manga
func TestGetChapters(t *testing.T) {
}

// GetChapter get detail from a chapter
func TestGetChapter(t *testing.T) {
}

// Login login to source
func TestLogin(t *testing.T) {
}

func TestFetchManga(t *testing.T) {
}

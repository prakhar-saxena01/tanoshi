package source

import (
	"errors"
	"io/ioutil"
	"net/http"
	"path"
	"strings"

	"github.com/mholt/archiver/v3"
)

type Local Source

func NewLocal(rootDir string) SourceInterface {
	return &Local{URL: rootDir}
}

// Initialize initialize source from specified path
func (l *Local) Initialize() error {
	l.Name = "local"
	if l.Config == nil {
		l.Config = &Config{
			make(http.Header),
			make(map[string]bool),
		}
	}

	return nil
}

// GetLatestUpdates get latest updates from source and return list of manga
func (l *Local) GetLatestUpdates(page int) ([]*Manga, error) {
	return l.FetchManga(Filter{})
}

// GetMangaDetails get details for a manga
func (l *Local) GetMangaDetails(m *Manga) (*Manga, error) {
	return m, nil
}

// GetChapters get list of chapter of a manga
func (l *Local) GetChapters(m *Manga) ([]*Chapter, error) {
	mangaPath := path.Join(l.URL, m.Path)

	files, err := ioutil.ReadDir(mangaPath)
	if err != nil {
		return nil, err
	}

	var chapters []*Chapter
	for i, file := range files {
		if strings.HasPrefix(file.Name(), ".") {
			continue
		}

		chapters = append(chapters, &Chapter{
			Source:     "local",
			MangaID:    m.ID,
			Path:       path.Join(m.Path, file.Name()),
			Number:     "",
			Title:      file.Name(),
			Language:   "",
			Rank:       float64(i),
			UploadedAt: file.ModTime(),
		})
	}
	return chapters, nil
}

// GetChapter get detail from a chapter
func (l *Local) GetChapter(c *Chapter) (*Chapter, error) {
	chapterPath := path.Join(l.URL, c.Path)

	var (
		page []*Page
		i    = 0
	)
	if strings.HasSuffix(chapterPath, ".cbz") {
		archiver.DefaultZip.Walk(chapterPath, func(f archiver.File) error {
			page = append(page, &Page{
				ChapterID: c.ID,
				Rank:      i,
				URL:       path.Join(chapterPath, f.Name()),
			})
			i++
			return nil
		})

	} else if strings.HasSuffix(chapterPath, ".cbr") {
		archiver.DefaultRar.Walk(chapterPath, func(f archiver.File) error {
			page = append(page, &Page{
				ChapterID: c.ID,
				Rank:      i,
				URL:       path.Join(chapterPath, f.Name()),
			})
			i++
			return nil
		})
	}

	c.Pages = page
	return c, nil
}

// Login login to source
func (l *Local) Login(username, password, twoFactor string, remember bool) error {
	return nil
}

// FetchManga fetch manga
func (l *Local) FetchManga(filter Filter) ([]*Manga, error) {
	dirs, err := ioutil.ReadDir(l.URL)
	if err != nil {
		return nil, err
	}

	var manga []*Manga
	for _, dir := range dirs {

		mangaPath := path.Join(l.URL, dir.Name())

		files, err := ioutil.ReadDir(mangaPath)
		if err != nil {
			continue
		}

		m := &Manga{
			Source:      "local",
			Title:       dir.Name(),
			Path:        dir.Name(),
			Description: "",
			CoverURL:    "",
			Authors:     "",
			Status:      "",
			Genres:      "",
			Chapters:    []Chapter{},
			IsFavorite:  false,
		}

		for _, file := range files {
			if strings.HasPrefix(file.Name(), ".") {
				continue
			}

			coverURL := ""
			archivePath := path.Join(mangaPath, file.Name())
			if strings.HasSuffix(archivePath, ".cbz") {
				archiver.DefaultZip.Walk(archivePath, func(f archiver.File) error {
					coverURL = f.Name()
					return errors.New("done")
				})

			} else if strings.HasSuffix(archivePath, ".cbr") {
				archiver.DefaultRar.Walk(archivePath, func(f archiver.File) error {
					coverURL = f.Name()
					return nil
				})
			}

			m.CoverURL = path.Join(archivePath, coverURL)
			break
		}
		manga = append(manga, m)
	}

	return manga, nil
}

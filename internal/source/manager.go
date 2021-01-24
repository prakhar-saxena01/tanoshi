package source

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

type Manager struct {
	repo    *Repository
	sources map[string]*Source
}

func NewManager(path string, repo *Repository) (*Manager, error) {
	sourceJsonFile, err := os.Open(path + "/source.json")
	if err != nil {
		return nil, err
	}

	sourceJsonBytes, err := ioutil.ReadAll(sourceJsonFile)
	if err != nil {
		return nil, err
	}

	var index []Source
	err = json.Unmarshal(sourceJsonBytes, &index)
	if err != nil {
		return nil, err
	}

	sources := make(map[string]*Source)
	for _, s := range index {
		source, err := LoadSourceFromPath(fmt.Sprintf("%s/source/%s/%s.lua", path, s.Name, s.Name))
		if err != nil {
			log.Println(err.Error())
			continue
		}

		sources[source.Name] = source
	}

	return &Manager{repo, sources}, nil
}

func (sm *Manager) List() []*Source {
	var sources []*Source
	for _, v := range sm.sources {
		sources = append(sources, v)
	}
	return sources
}

func (sm *Manager) Get(name string) *Source {
	return sm.sources[name]
}
func (sm *Manager) GetLatestUpdates(name string, page int) ([]*Manga, error) {
	mangas, err := sm.Get(name).GetLatestUpdates(page)
	if err != nil {
		return nil, err
	}

	mangas, err = sm.repo.SaveMangaInBatch(mangas)
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

func (sm *Manager) GetMangaDetails(id uint, includeChapter bool) (*Manga, error) {
	manga, err := sm.repo.GetMangaByID(id, includeChapter)
	if err != nil {
		return nil, err
	}
	if manga == nil {
		return nil, errors.New("manga not found")
	}
	if !manga.IsIncomplete() {
		if includeChapter && len(manga.Chapters) > 0 {
			return manga, nil
		} else if !includeChapter {
			return manga, nil
		}
	}
	manga, err = sm.Get(manga.Source).GetMangaDetails(manga)
	if err != nil {
		return nil, err
	}
	if includeChapter {
		chapters, err := sm.Get(manga.Source).GetChapters(manga)
		if err != nil {
			return nil, err
		}

		for i := range chapters {
			manga.Chapters = append(manga.Chapters, *chapters[i])
		}
	}
	manga, err = sm.repo.SaveManga(manga)
	if err != nil {
		return nil, err
	}
	return manga, nil
}

func (sm *Manager) GetChapters(mangaID uint) ([]*Chapter, error) {
	c, err := sm.repo.GetChaptersByMangaID(mangaID)
	if err != nil {
		return nil, err
	}
	if c != nil {
		return c, nil
	}
	manga, err := sm.repo.GetMangaByID(mangaID, true)
	if err != nil {
		return nil, err
	}
	if manga == nil {
		return nil, errors.New("manga not found")
	}
	if err != nil {
		return nil, err
	}

	return c, nil
}

func (sm *Manager) GetChapter(chapterID uint) (*Chapter, error) {
	chapter, err := sm.repo.GetChapterByID(chapterID)
	if err != nil {
		return nil, err
	}
	if chapter == nil {
		return nil, errors.New("chapter not found")
	}
	if chapter.Pages != nil && len(chapter.Pages) > 0 {
		return chapter, nil
	}
	chapter, err = sm.Get(chapter.Source).GetChapter(chapter)
	if err != nil {
		return nil, err
	}
	chapter, err = sm.repo.SaveChapter(chapter)
	if err != nil {
		return nil, err
	}
	return chapter, err
}

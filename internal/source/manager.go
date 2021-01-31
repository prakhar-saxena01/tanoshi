package source

import (
	"strconv"

	jsoniter "github.com/json-iterator/go"

	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

var RepositoryURL = "https://faldez.github.io/tanoshi-extensions"

type Manager struct {
	repo    *Repository
	sources map[string]*Source
}

func NewManager(repo *Repository) (*Manager, error) {
	sources, err := repo.GetSources()
	if err != nil {
		return nil, err
	}

	for name := range sources {
		if err := sources[name].Initialize(); err != nil {
			log.Println(err.Error())
			continue
		}
	}

	return &Manager{repo, sources}, nil
}

func (sm *Manager) GetSourcesFromRemote() ([]*Source, error) {
	resp, err := http.Get(fmt.Sprintf("%s/source.json", strings.TrimSuffix(RepositoryURL, "/")))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var sources []*Source

	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	err = json.NewDecoder(resp.Body).Decode(&sources)
	if err != nil {
		return nil, err
	}

	for i := range sources {
		name := sources[i].Name

		sources[i].Icon = fmt.Sprintf("%s/source/%s/icon.png", strings.TrimSuffix(RepositoryURL, "/"), name)
		_, sources[i].Installed = sm.sources[name]
		if sources[i].Installed {

			remoteVersion := strings.Split(sources[i].Version, ".")
			installedVersion := strings.Split(sm.sources[name].Version, ".")

			remoteMajor, _ := strconv.ParseInt(remoteVersion[0], 10, 64)
			remoteMinor, _ := strconv.ParseInt(remoteVersion[1], 10, 64)
			remotePatch, _ := strconv.ParseInt(remoteVersion[2], 10, 64)

			installedMajor, _ := strconv.ParseInt(installedVersion[0], 10, 64)
			installedMinor, _ := strconv.ParseInt(installedVersion[1], 10, 64)
			installedPatch, _ := strconv.ParseInt(installedVersion[2], 10, 64)

			if remoteMajor > installedMajor {
				sources[i].Update = true
			} else if remoteMajor == installedMajor {
				if remoteMinor > installedMinor {
					sources[i].Update = true
				} else if remoteMinor == installedMinor {
					if remotePatch > installedPatch {
						sources[i].Update = true
					}
				}
			}
			sources[i].Version = sm.sources[name].Version
		}
	}

	return sources, nil
}

func (sm *Manager) InstallSource(name string) error {
	if _, installed := sm.sources[name]; installed {
		return errors.New("source installed")
	}
	resp, err := http.Get(fmt.Sprintf("%s/source/%s/%s.lua", RepositoryURL, name, name))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	source := Source{
		Name: name,
	}
	source.Contents, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	err = source.Initialize()
	if err != nil {
		return err
	}
	source.Icon = fmt.Sprintf("%s/source/%s/icon.png", RepositoryURL, name)

	err = sm.repo.CreateSource(&source)
	if err != nil {
		return err
	}

	sm.sources[name] = &source
	return nil
}

func (sm *Manager) UpdateSource(name string) error {
	if _, installed := sm.sources[name]; !installed {
		return errors.New("source not installed")
	}
	sm.sources[name] = nil

	resp, err := http.Get(fmt.Sprintf("%s/source/%s/%s.lua", RepositoryURL, name, name))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	source := Source{
		Name: name,
	}
	source.Contents, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	err = source.Initialize()
	if err != nil {
		return err
	}

	err = sm.repo.UpdateSource(&source)
	if err != nil {
		return err
	}

	sm.sources[name] = &source
	return nil
}

func (sm *Manager) List() ([]*Source, error) {
	sourcesMap, err := sm.repo.GetSources()
	if err != nil {
		return nil, err
	}
	var sources []*Source
	for _, v := range sourcesMap {
		sources = append(sources, v)
	}
	return sources, nil
}

func (sm *Manager) GetSourceConfig(name string) (*Config, error) {
	s, ok := sm.sources[name]
	if !ok {
		return nil, errors.New("No source")
	}

	return &Config{
		Language: s.Config.Language,
	}, nil
}

func (sm *Manager) UpdateSourceConfig(name string, c *Config) error {
	s, ok := sm.sources[name]
	if !ok {
		return errors.New("No source")
	}

	c.Header = s.Config.Header
	s.Config = c
	return sm.repo.SaveSourceConfig(s)
}

func (sm *Manager) Get(name string) *Source {
	return sm.sources[name]
}

func (sm *Manager) GetLatestUpdates(name string, page int) ([]*Manga, error) {
	s, ok := sm.sources[name]
	if !ok {
		return nil, errors.New("No source")
	}

	mangas, err := s.GetLatestUpdates(page)
	if err != nil {
		return nil, err
	}

	mangas, err = sm.repo.SaveMangaInBatch(mangas)
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

func (sm *Manager) SearchManga(name string, filter Filter) ([]*Manga, error) {
	s, ok := sm.sources[name]
	if !ok {
		return nil, errors.New("No source")
	}

	mangas, err := s.FetchManga(filter)
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

func (sm *Manager) Login(name, username, password, twoFactor string, remember bool) error {
	s, ok := sm.sources[name]
	if !ok {
		return errors.New("No source")
	}

	if err := s.Login(username, password, twoFactor, remember); err != nil {
		return err
	}

	if err := sm.repo.SaveSourceConfig(sm.Get(name)); err != nil {
		return err
	}

	return nil
}

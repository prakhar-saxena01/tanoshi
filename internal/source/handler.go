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

type Handler struct {
	repo    *Repository
	sources map[string]SourceInterface
}

func NewHandler(repo *Repository, localDir string) (*Handler, error) {
	sources, err := repo.GetSources()
	if err != nil {
		return nil, err
	}

	sources["local"] = NewLocal(localDir)
	for name := range sources {
		if err := sources[name].Initialize(); err != nil {
			log.Println(err.Error())
			continue
		}
	}

	return &Handler{repo, sources}, nil
}

func (h *Handler) GetSourcesFromRemote() ([]SourceInterface, error) {
	resp, err := http.Get(fmt.Sprintf("%s/source.json", strings.TrimSuffix(RepositoryURL, "/")))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var (
		sources    []Source
		retSources []SourceInterface
	)

	var json = jsoniter.ConfigCompatibleWithStandardLibrary
	err = json.NewDecoder(resp.Body).Decode(&sources)
	if err != nil {
		return nil, err
	}

	for i := range sources {
		retSources = append(retSources, &sources[i])

		name := sources[i].Name

		s, ok := h.sources[name].(*Source)
		if !ok {
			continue
		}

		sources[i].Icon = fmt.Sprintf("%s/source/%s/icon.png", strings.TrimSuffix(RepositoryURL, "/"), name)
		_, sources[i].Installed = h.sources[name]
		if sources[i].Installed {
			remoteVersion := strings.Split(sources[i].Version, ".")
			installedVersion := strings.Split(s.Version, ".")

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
			sources[i].Version = s.Version
		}
	}

	return retSources, nil
}

func (h *Handler) InstallSource(name string) error {
	if _, installed := h.sources[name]; installed {
		return errors.New("source installed")
	}
	resp, err := http.Get(fmt.Sprintf("%s/source/%s/%s.lua", RepositoryURL, name, name))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	contents, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	icon := fmt.Sprintf("%s/source/%s/icon.png", RepositoryURL, name)

	source := NewSource(name, contents, icon)
	err = source.Initialize()
	if err != nil {
		return err
	}

	err = h.repo.CreateSource(source)
	if err != nil {
		return err
	}

	h.sources[name] = source
	return nil
}

func (h *Handler) UpdateSource(name string) error {
	_, installed := h.sources[name]
	if !installed {
		return errors.New("source not installed")
	}
	h.sources[name] = nil

	resp, err := http.Get(fmt.Sprintf("%s/source/%s/%s.lua", RepositoryURL, name, name))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	contents, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	icon := fmt.Sprintf("%s/source/%s/icon.png", RepositoryURL, name)

	source := NewSource(name, contents, icon)
	err = source.Initialize()
	if err != nil {
		return err
	}

	err = h.repo.UpdateSource(source)
	if err != nil {
		return err
	}

	h.sources[name] = source
	return nil
}

func (h *Handler) List() ([]SourceInterface, error) {
	var sources []SourceInterface
	for _, v := range h.sources {
		sources = append(sources, v)
	}
	return sources, nil
}

func (h *Handler) GetSourceConfig(name string) (*Config, error) {
	s, ok := h.sources[name].(*Source)
	if !ok {
		return nil, errors.New("No source")
	}

	return &Config{
		Language: s.Config.Language,
	}, nil
}

func (h *Handler) GetSourceFilters(name string) ([]*FilterField, error) {
	s, ok := h.sources[name].(*Source)
	if !ok {
		return nil, errors.New("No source")
	}

	return s.Filters, nil
}

func (h *Handler) UpdateSourceConfig(name string, c *Config) error {
	s, ok := h.sources[name].(*Source)
	if !ok {
		return errors.New("No source")
	}

	c.Header = s.Config.Header
	cfg, err := h.repo.SaveSourceConfig(name, c)
	if err != nil {
		return err
	}

	s.Config = cfg
	return nil
}

func (h *Handler) Get(name string) SourceInterface {
	return h.sources[name]
}

func (h *Handler) GetLatestUpdates(name string, page int) ([]*Manga, error) {
	s, ok := h.sources[name]
	if !ok {
		return nil, errors.New("No source")
	}

	mangas, err := s.GetLatestUpdates(page)
	if err != nil {
		return nil, err
	}

	mangas, err = h.repo.SaveMangaInBatch(mangas)
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

func (h *Handler) SearchManga(name string, filter Filter) ([]*Manga, error) {
	s, ok := h.sources[name]
	if !ok {
		return nil, errors.New("No source")
	}

	mangas, err := s.FetchManga(filter)
	if err != nil {
		return nil, err
	}

	mangas, err = h.repo.SaveMangaInBatch(mangas)
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

func (h *Handler) GetMangaDetails(id uint, includeChapter bool, refresh bool) (*Manga, error) {
	manga, err := h.repo.GetMangaByID(id, includeChapter)
	if err != nil {
		return nil, err
	}
	if manga == nil {
		return nil, errors.New("manga not found")
	}

	if !manga.IsIncomplete() && !refresh {
		if includeChapter && len(manga.Chapters) > 0 {
			return manga, nil
		} else if !includeChapter {
			return manga, nil
		}
	}

	manga, err = h.Get(manga.Source).GetMangaDetails(manga)
	if err != nil {
		return nil, err
	}
	if includeChapter {
		chapters, err := h.Get(manga.Source).GetChapters(manga)
		if err != nil {
			return nil, err
		}

		for i := range chapters {
			manga.Chapters = append(manga.Chapters, *chapters[i])
		}
	}
	manga, err = h.repo.UpdateManga(manga)
	if err != nil {
		return nil, err
	}
	return manga, nil
}

func (h *Handler) GetChapters(mangaID uint) ([]*Chapter, error) {
	c, err := h.repo.GetChaptersByMangaID(mangaID)
	if err != nil {
		return nil, err
	}
	if c != nil {
		return c, nil
	}

	manga, err := h.repo.GetMangaByID(mangaID, true)
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

func (h *Handler) GetChapter(chapterID uint) (*Chapter, error) {
	chapter, err := h.repo.GetChapterByID(chapterID)
	if err != nil {
		return nil, err
	}
	if chapter == nil {
		return nil, errors.New("chapter not found")
	}
	if chapter.Pages != nil && len(chapter.Pages) > 0 {
		return chapter, nil
	}
	chapter, err = h.Get(chapter.Source).GetChapter(chapter)
	if err != nil {
		return nil, err
	}
	chapter, err = h.repo.SaveChapter(chapter)
	if err != nil {
		return nil, err
	}
	chapter, err = h.repo.GetChapterByID(chapterID)
	if err != nil {
		return nil, err
	}
	return chapter, err
}

func (h *Handler) Login(name, username, password, twoFactor string, remember bool) error {
	s, ok := h.sources[name].(*Source)
	if !ok {
		return errors.New("No source")
	}

	if err := s.Login(username, password, twoFactor, remember); err != nil {
		return err
	}

	if _, err := h.repo.SaveSourceConfig(name, s.Config); err != nil {
		return err
	}

	return nil
}

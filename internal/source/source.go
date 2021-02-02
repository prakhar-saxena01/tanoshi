package source

import (
	"bytes"
	"errors"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/faldez/tanoshi/internal/lua/helper"
	"github.com/faldez/tanoshi/internal/lua/scraper"
	lua "github.com/yuin/gopher-lua"
	"gorm.io/gorm"
	luajson "layeh.com/gopher-json"
	luar "layeh.com/gopher-luar"
)

type SourceInterface interface {
	Initialize() error
	GetLatestUpdates(page int) ([]*Manga, error)
	GetMangaDetails(m *Manga) (*Manga, error)
	GetChapters(m *Manga) ([]*Chapter, error)
	GetChapter(c *Chapter) (*Chapter, error)
	Login(username, password, twoFactor string, remember bool) error
	FetchManga(filter Filter) ([]*Manga, error)
}

type Source struct {
	gorm.Model
	Name       string  `gorm:"unique_index"`
	Contents   []byte  `json:"-"`
	Config     *Config `json:"-"`
	Installed  bool    `gorm:"-"`
	Version    string
	URL        string
	Icon       string
	Update     bool `gorm:"-"`
	l          *lua.LState
	httpClient *http.Client
}

func NewSource(name string, contents []byte, icon string) SourceInterface {
	return &Source{Name: name, Contents: contents, Icon: icon}
}

// Initialize initialize source from specified path
func (s *Source) Initialize() error {
	s.l = lua.NewState()
	if s.Config == nil {
		s.Config = &Config{
			Header:   make(http.Header),
			Language: make(map[string]bool),
		}
	}
	s.httpClient = &http.Client{}

	s.l.PreloadModule("scraper", scraper.NewHTMLScraper().Loader)
	s.l.PreloadModule("helper", helper.NewHelper().Loader)
	luajson.Preload(s.l)

	s.l.SetGlobal(luaMangaTypeName, luar.NewType(s.l, Manga{}))
	s.l.SetGlobal(luaChapterTypeName, luar.NewType(s.l, Chapter{}))
	s.l.SetGlobal(luaPageTypeName, luar.NewType(s.l, Page{}))

	if err := s.l.DoString(string(s.Contents)); err != nil {
		return err
	}

	if err := s.getName(); err != nil {
		s.l.Close()
		return err
	}
	if err := s.getBaseURL(); err != nil {
		s.l.Close()
		return err
	}
	if err := s.getLanguageOptions(); err != nil {
		s.l.Close()
		return err
	}
	if err := s.getVersion(); err != nil {
		s.l.Close()
		return err
	}

	return nil
}

func (s *Source) getName() error {
	if err := s.callLuaFunc("name"); err != nil {
		return err
	}
	s.Name = s.l.CheckString(1)
	s.l.Pop(1)
	return nil
}

func (s *Source) getBaseURL() error {
	if err := s.callLuaFunc("base_url"); err != nil {
		return err
	}
	s.URL = s.l.CheckString(1)
	s.l.Pop(1)
	return nil
}

func (s *Source) getLanguageOptions() error {
	if err := s.callLuaFunc("languages"); err != nil {
		return err
	}

	tbl := s.l.CheckTable(1)
	tbl.ForEach(func(_, v lua.LValue) {
		if _, ok := s.Config.Language[v.String()]; !ok {
			s.Config.Language[v.String()] = true
		}
	})

	s.l.Pop(1)
	return nil
}

func (s *Source) getVersion() error {
	if err := s.callLuaFunc("version"); err != nil {
		return err
	}
	s.Version = s.l.CheckString(1)
	s.l.Pop(1)
	return nil
}

func (s *Source) getLatestUpdatesRequest(page int) (*SourceResponse, error) {
	if err := s.callLuaFunc("get_latest_updates_request", lua.LNumber(page)); err != nil {
		return nil, err
	}

	request, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(request)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) getLatestUpdates(body *string) ([]*Manga, error) {
	if err := s.callLuaFunc("get_latest_updates", lua.LString(*body)); err != nil {
		return nil, err
	}
	lv := s.l.Get(-1)

	var manga []*Manga
	if tbl, ok := lv.(*lua.LTable); ok {
		tbl.ForEach(func(_, v lua.LValue) {
			if ud, ok := v.(*lua.LUserData); ok {
				if m, ok := ud.Value.(*Manga); ok {
					m.Source = s.Name
					manga = append(manga, m)
				}
			}
		})
	}
	return manga, nil
}

// GetLatestUpdates get latest updates from source and return list of manga
func (s *Source) GetLatestUpdates(page int) ([]*Manga, error) {
	res, err := s.getLatestUpdatesRequest(page)
	if err != nil {
		return nil, err
	}

	mangaList, err := s.getLatestUpdates(&res.Body)
	if err != nil {
		return nil, err
	}

	return mangaList, nil
}

func (s *Source) getMangaDetailsRequest(m *Manga) (*SourceResponse, error) {
	if err := s.callLuaFunc("get_manga_details_request", luar.New(s.l, *m)); err != nil {
		return nil, err
	}

	request, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(request)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) getMangaDetails(body *string) (*Manga, error) {
	if err := s.callLuaFunc("get_manga_details", lua.LString(*body)); err != nil {
		return nil, err
	}
	lv := s.l.Get(-1)

	var manga *Manga
	ud := lv.(*lua.LUserData)
	manga = ud.Value.(*Manga)
	manga.Source = s.Name
	return manga, nil
}

// GetMangaDetails get details for a manga
func (s *Source) GetMangaDetails(m *Manga) (*Manga, error) {
	res, err := s.getMangaDetailsRequest(m)
	if err != nil {
		return nil, err
	}
	manga, err := s.getMangaDetails(&res.Body)
	if err != nil {
		return nil, err
	}
	manga.ID = m.ID

	return manga, nil
}

func (s *Source) getChaptersRequest(m *Manga) (*SourceResponse, error) {
	if err := s.callLuaFunc("get_chapters_request", luar.New(s.l, *m)); err != nil {
		return nil, err
	}

	req, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) getChapters(body *string) ([]*Chapter, error) {
	if err := s.callLuaFunc("get_chapters", lua.LString(*body)); err != nil {
		return nil, err
	}
	lv := s.l.Get(-1)

	var chapters []*Chapter
	if tbl, ok := lv.(*lua.LTable); ok {
		tbl.ForEach(func(_, v lua.LValue) {
			if ud, ok := v.(*lua.LUserData); ok {
				if c, ok := ud.Value.(*Chapter); ok {
					if s.Config.Language[c.Language] {
						c.Source = s.Name
						c.Rank, _ = strconv.ParseFloat(c.Number, 64)
						chapters = append(chapters, c)
					}
				}
			}
		})
	}
	return chapters, nil
}

// GetChapters get list of chapter of a manga
func (s *Source) GetChapters(m *Manga) ([]*Chapter, error) {
	res, err := s.getChaptersRequest(m)
	if err != nil {
		return nil, err
	}
	chapters, err := s.getChapters(&res.Body)
	if err != nil {
		return nil, err
	}

	return chapters, nil
}

func (s *Source) getChapterRequest(c *Chapter) (*SourceResponse, error) {
	if err := s.callLuaFunc("get_chapter_request", luar.New(s.l, *c)); err != nil {
		return nil, err
	}

	req, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) getChapter(body *string) (*Chapter, error) {
	if err := s.callLuaFunc("get_chapter", lua.LString(*body)); err != nil {
		return nil, err
	}
	lv := s.l.Get(-1)

	var chapter *Chapter
	ud := lv.(*lua.LUserData)
	chapter = ud.Value.(*Chapter)

	return chapter, nil
}

// GetChapter get detail from a chapter
func (s *Source) GetChapter(c *Chapter) (*Chapter, error) {
	res, err := s.getChapterRequest(c)
	if err != nil {
		return nil, err
	}
	chapter, err := s.getChapter(&res.Body)
	if err != nil {
		return nil, err
	}
	chapter.ID = c.ID

	return chapter, nil
}

func (s *Source) loginRequest(username, password, twoFactor string, remember bool) (*SourceResponse, error) {
	param := map[string]string{
		"username":    username,
		"password":    password,
		"two_factor":  twoFactor,
		"remember_me": "1",
	}
	if err := s.callLuaFunc("login_request", luar.New(s.l, param)); err != nil {
		return nil, err
	}

	req, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) login(resp *SourceResponse) error {
	header := map[string][]string(resp.Header)
	body := resp.Body
	if err := s.callLuaFunc("login", luar.New(s.l, header), lua.LString(body)); err != nil {
		return err
	}
	lv := s.l.Get(-1)
	if tbl, ok := lv.(*lua.LTable); ok {
		tbl.ForEach(func(k, v lua.LValue) {
			if values, ok := v.(*lua.LTable); ok {
				s.Config.Header.Del(k.String())
				values.ForEach(func(i, w lua.LValue) {
					s.Config.Header.Add(k.String(), w.String())
				})
			}
		})
	} else {
		return errors.New("Table expected")
	}
	return nil
}

// Login login to source
func (s *Source) Login(username, password, twoFactor string, remember bool) error {
	resp, err := s.loginRequest(username, password, twoFactor, remember)
	if err != nil {
		return err
	}

	err = s.login(resp)
	if err != nil {
		return err
	}

	return nil
}

func (s *Source) fetchMangaRequest(filter Filter) (*SourceResponse, error) {
	if err := s.callLuaFunc("fetch_manga_request", luar.New(s.l, filter)); err != nil {
		return nil, err
	}

	req, err := s.createRequest()
	if err != nil {
		return nil, err
	}

	resp, err := s.doRequest(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *Source) fetchManga(body *string) ([]*Manga, error) {
	if err := s.callLuaFunc("fetch_manga", lua.LString(*body)); err != nil {
		return nil, err
	}
	lv := s.l.Get(-1)

	var manga []*Manga
	if tbl, ok := lv.(*lua.LTable); ok {
		tbl.ForEach(func(_, v lua.LValue) {
			if ud, ok := v.(*lua.LUserData); ok {
				if m, ok := ud.Value.(*Manga); ok {
					m.Source = s.Name
					manga = append(manga, m)
				}
			}
		})
	}
	return manga, nil
}

func (s *Source) FetchManga(filter Filter) ([]*Manga, error) {
	res, err := s.fetchMangaRequest(filter)
	if err != nil {
		return nil, err
	}

	mangaList, err := s.fetchManga(&res.Body)
	if err != nil {
		return nil, err
	}

	return mangaList, nil
}

func (s *Source) headerBuilder() *http.Header {
	var header http.Header
	if s.Config.Header != nil {
		header = s.Config.Header.Clone()
	} else {
		header = make(http.Header)
	}

	header.Set("User-Agent", "Tanoshi/0.1.0")
	return &header
}

func (s *Source) createRequest() (*http.Request, error) {
	lv := s.l.Get(-1)

	req, ok := lv.(*lua.LTable)
	if !ok {
		return nil, errors.New("table expected")
	}

	var (
		buffer    bytes.Buffer
		headerMap *http.Header = s.headerBuilder()
	)

	headers, headersOk := req.RawGetString("header").(*lua.LTable)
	if headersOk {
		headers.ForEach(func(k lua.LValue, v lua.LValue) {
			headerMap.Set(k.String(), v.String())
		})
	}

	contentType := headerMap.Get("Content-Type")
	data, dataOk := req.RawGetString("data").(*lua.LTable)
	if dataOk {
		switch contentType {
		case "multipart/form-data":
			writer := multipart.NewWriter(&buffer)

			data.ForEach(func(k lua.LValue, v lua.LValue) {
				writer.WriteField(k.String(), v.String())
			})

			writer.Close()
			headerMap.Set("Content-Type", writer.FormDataContentType())
			break
		}
	}

	method := req.RawGetString("method").String()
	url := req.RawGetString("url").String()

	request, err := http.NewRequest(method, url, &buffer)
	if err != nil {
		return nil, err
	}
	request.Header = *headerMap

	return request, nil
}

func (s *Source) doRequest(req *http.Request) (*SourceResponse, error) {
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	response := SourceResponse{
		Header: resp.Header,
		Body:   string(body),
	}

	return &response, nil
}

func (s *Source) callLuaFunc(name string, args ...lua.LValue) error {
	return s.l.CallByParam(lua.P{
		Fn:      s.l.GetGlobal(name),
		NRet:    1,
		Protect: true,
	}, args...)
}

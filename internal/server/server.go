package server

import (
	"fmt"
	"net/http"
	"strconv"

	rice "github.com/GeertJohan/go.rice"
	"github.com/faldez/tanoshi/internal/history"
	"github.com/faldez/tanoshi/internal/library"
	"github.com/faldez/tanoshi/internal/proxy"
	"github.com/faldez/tanoshi/internal/source"
	"github.com/faldez/tanoshi/internal/update"

	"golang.org/x/sync/singleflight"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	sourceHandler  *source.Handler
	libraryHandler *library.Handler
	historyHandler *history.Handler
	updateHandler  *update.Handler
	proxy          *proxy.Proxy
	r              *echo.Echo
	requestGroup   singleflight.Group
	box            *rice.Box
}

func NewServer(sourceHandler *source.Handler,
	libraryHandler *library.Handler,
	historyHandler *history.Handler,
	updateHandler *update.Handler,
	proxy *proxy.Proxy,
	box *rice.Box) Server {
	r := echo.New()
	var requestGroup singleflight.Group
	return Server{sourceHandler, libraryHandler, historyHandler, updateHandler, proxy, r, requestGroup, box}
}

func (s *Server) RegisterHandler() {
	s.r.Use(middleware.Logger())
	s.r.Use(middleware.Recover())

	api := s.r.Group("/api")

	api.GET("/source", func(c echo.Context) error {
		var (
			sourceList []*source.Source
			err        error
		)

		installed, _ := strconv.ParseBool(c.QueryParam("installed"))
		sourceList, err = s.sourceHandler.GetSourcesFromRemote()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}

		if installed {
			var sources []*source.Source
			for i := range sourceList {
				if sourceList[i].Installed {
					sources = append(sources, sourceList[i])
				}
			}
			return c.JSON(http.StatusOK, sources)
		}

		return c.JSON(http.StatusOK, sourceList)
	})
	api.POST("/source/:name", func(c echo.Context) error {
		err := s.sourceHandler.InstallSource(c.Param("name"))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.String(http.StatusOK, "OK")
	})
	api.PUT("/source/:name", func(c echo.Context) error {
		err := s.sourceHandler.UpdateSource(c.Param("name"))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.String(http.StatusOK, "OK")
	})
	api.GET("/source/:name/config", func(c echo.Context) error {
		config, err := s.sourceHandler.GetSourceConfig(c.Param("name"))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, config)
	})
	api.PUT("/source/:name/config", func(c echo.Context) error {
		config := new(source.Config)
		if err := c.Bind(config); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		err := s.sourceHandler.UpdateSourceConfig(c.Param("name"), config)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, config)
	})
	api.GET("/source/:name", func(c echo.Context) error {
		name := c.Param("name")

		req := new(SearchSourceRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		mangas, err, _ := s.requestGroup.Do(fmt.Sprintf("source/%s", name), func() (interface{}, error) {
			mangas, err := s.sourceHandler.SearchManga(name, source.Filter{
				Title: req.Title,
				Page:  req.Page,
			})
			if err != nil {
				return nil, c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
			}
			return mangas, nil
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, mangas)
	})
	api.GET("/source/:name/latest", func(c echo.Context) error {
		name := c.Param("name")
		page, _ := strconv.ParseInt(c.QueryParam("page"), 10, 64)

		latestManga, err, _ := s.requestGroup.Do(fmt.Sprintf("source/%s/latest", name), func() (interface{}, error) {
			latestManga, err := s.sourceHandler.GetSourceLatestUpdates(name, int(page))
			if err != nil {
				return nil, err
			}
			return latestManga, nil
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, latestManga)
	})
	api.GET("/source/:name/detail", func(c echo.Context) error {
		name := c.Param("name")
		source, err := s.sourceHandler.GetSourceDetail(name)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, source)
	})
	api.POST("/source/:name/login", func(c echo.Context) error {
		req := new(LoginRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		err := s.sourceHandler.Login(c.Param("name"), req.Username, req.Password, req.TwoFactor, req.Remember)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.String(200, "OK")
	})
	api.GET("/manga/:id", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		includeChapter, _ := strconv.ParseBool(c.QueryParam("includeChapter"))

		manga, err, _ := s.requestGroup.Do(fmt.Sprintf("manga/%d/%v", id, includeChapter), func() (interface{}, error) {
			manga, err := s.sourceHandler.GetMangaDetails(uint(id), includeChapter)
			if err != nil {
				return nil, err
			}

			return manga, nil
		})

		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, manga)
	})
	api.GET("/manga/:id/chapters", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

		chapters, err, _ := s.requestGroup.Do(fmt.Sprintf("manga/%d/chapters", id), func() (interface{}, error) {
			chapters, err := s.sourceHandler.GetChapters(uint(id))
			if err != nil {
				return nil, err
			}

			return chapters, nil
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, chapters)
	})

	api.GET("/chapter/:id", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

		chapter, err, _ := s.requestGroup.Do(fmt.Sprintf("chapter/%d", id), func() (interface{}, error) {
			chapter, err := s.sourceHandler.GetChapter(uint(id))
			if err != nil {
				return nil, err
			}

			return chapter, nil
		})
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, chapter)
	})

	api.GET("/library", func(c echo.Context) error {
		req := new(SearchLibraryRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		mangas, err := s.libraryHandler.GetMangaFromLibrary()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.JSON(http.StatusOK, mangas)
	})
	api.POST("/library/manga/:id", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		if id == 0 {
			return c.JSON(http.StatusBadRequest, ErrorMessage{"invalid id"})
		}

		err := s.libraryHandler.SaveToLibrary(uint(id))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.String(200, "OK")
	})
	api.DELETE("/library/manga/:id", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		if id == 0 {
			return c.JSON(http.StatusBadRequest, ErrorMessage{"invalid id"})
		}

		err := s.libraryHandler.DeleteFromLibrary(uint(id))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		return c.String(200, "OK")
	})
	api.GET("/history", func(c echo.Context) error {
		req := new(GetHistoryRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		histories, err := s.historyHandler.GetHistories(req.Page, req.Limit)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}

		if histories == nil {
			return c.JSON(http.StatusNoContent, []*history.History{})
		}

		return c.JSON(http.StatusOK, histories)
	})
	api.PUT("/history/chapter/:id", func(c echo.Context) error {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		if id == 0 {
			return c.JSON(http.StatusBadRequest, ErrorMessage{"invalid id"})
		}

		req := new(UpdateHistoryRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		err := s.historyHandler.UpdateChapterLastPageRead(uint(id), req.Page)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}

		return c.String(200, "OK")
	})
	api.GET("/update", func(c echo.Context) error {
		req := new(GetUpdateRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		updates, err := s.updateHandler.GetUpdates(req.Page, req.Limit)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}

		if updates == nil {
			return c.JSON(http.StatusNoContent, []update.Update{})
		}

		return c.JSON(http.StatusOK, updates)
	})
	api.GET("/proxy", func(c echo.Context) error {
		req := new(ProxyRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, ErrorMessage{err.Error()})
		}

		data, contentType, err := s.proxy.Get(req.URL)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, ErrorMessage{err.Error()})
		}
		c.Response().Header().Add("Cache-Control", "max-age=31536000")
		return c.Blob(http.StatusOK, contentType, data)
	})

	assetHandler := http.FileServer(s.box.HTTPBox())
	s.r.GET("/*", echo.WrapHandler(assetHandler), middleware.Rewrite(map[string]string{
		"/manga/*":    "/",
		"/chapter/*":  "/",
		"/browse/*":   "/",
		"/history/*":  "/",
		"/update/*":   "/",
		"/settings/*": "/",
	}))
}

func (s *Server) Run(addr string) error {
	defer s.r.Close()
	return s.r.Start(addr)
}

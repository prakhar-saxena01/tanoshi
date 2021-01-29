package server

import (
	"fmt"
	"strconv"

	"github.com/faldez/tanoshi/internal/history"
	"github.com/faldez/tanoshi/internal/library"
	"github.com/faldez/tanoshi/internal/source"
	"github.com/faldez/tanoshi/internal/update"
	"github.com/gin-gonic/gin"

	"golang.org/x/sync/singleflight"
)

type Server struct {
	sourceHandler  *source.Handler
	libraryHandler *library.Handler
	historyHandler *history.Handler
	updateHandler  *update.Handler
	r              *gin.Engine
	requestGroup   singleflight.Group
}

func NewServer(sourceHandler *source.Handler,
	libraryHandler *library.Handler,
	historyHandler *history.Handler,
	updateHandler *update.Handler) Server {
	r := gin.Default()
	var requestGroup singleflight.Group
	return Server{sourceHandler, libraryHandler, historyHandler, updateHandler, r, requestGroup}
}

func (s *Server) RegisterHandler() {
	api := s.r.Group("/api")

	api.GET("/source", func(c *gin.Context) {
		var (
			sourceList []*source.Source
			err        error
		)
		if _, installed := c.GetQuery("installed"); !installed {
			sourceList, err = s.sourceHandler.GetSourcesFromRemote()
			if err != nil {
				c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
				return
			}
		} else {
			sourceList, err = s.sourceHandler.GetSourceList()
			if err != nil {
				c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
				return
			}
		}

		c.JSON(200, sourceList)
	})
	api.POST("/source/:name/install", func(c *gin.Context) {
		err := s.sourceHandler.InstallSource(c.Param("name"))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.GET("/source/:name/config", func(c *gin.Context) {
		config, err := s.sourceHandler.GetSourceConfig(c.Param("name"))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, config)
	})
	api.PUT("/source/:name/config", func(c *gin.Context) {
		var config source.Config
		if err := c.ShouldBindJSON(&config); err != nil {
			c.AbortWithStatusJSON(400, ErrorMessage{err.Error()})
			return
		}

		err := s.sourceHandler.UpdateSourceConfig(c.Param("name"), &config)
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, config)
	})
	api.GET("/source/:name", func(c *gin.Context) {
		name := c.Param("name")
		filters := c.QueryMap("filters")

		mangas, err, _ := s.requestGroup.Do(fmt.Sprintf("source/%s", name), func() (interface{}, error) {
			mangas, err := s.sourceHandler.SearchManga(name, filters)
			if err != nil {
				c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
				return nil, err
			}
			return mangas, nil
		})
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, mangas)
	})
	api.GET("/source/:name/latest", func(c *gin.Context) {
		name := c.Param("name")
		page, _ := strconv.ParseInt(c.DefaultQuery("page", "1"), 10, 64)

		latestManga, err, _ := s.requestGroup.Do(fmt.Sprintf("source/%s/latest", name), func() (interface{}, error) {
			latestManga, err := s.sourceHandler.GetSourceLatestUpdates(name, int(page))
			if err != nil {
				return nil, err
			}
			return latestManga, nil
		})
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, latestManga)
	})
	api.GET("/source/:name/detail", func(c *gin.Context) {
		name := c.Param("name")
		source, err := s.sourceHandler.GetSourceDetail(name)
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, source)
	})
	api.POST("/source/:name/login", func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.AbortWithStatusJSON(400, ErrorMessage{err.Error()})
			return
		}

		err := s.sourceHandler.Login(c.Param("name"), req.Username, req.Password, req.TwoFactor, req.Remember)
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.GET("/manga/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		includeChapter, _ := strconv.ParseBool(c.DefaultQuery("includeChapter", "false"))

		manga, err, _ := s.requestGroup.Do(fmt.Sprintf("manga/%d/%v", id, includeChapter), func() (interface{}, error) {
			manga, err := s.sourceHandler.GetMangaDetails(uint(id), includeChapter)
			if err != nil {
				return nil, err
			}

			return manga, nil
		})

		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, manga)
	})
	api.GET("/manga/:id/chapters", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

		chapters, err, _ := s.requestGroup.Do(fmt.Sprintf("manga/%d/chapters", id), func() (interface{}, error) {
			chapters, err := s.sourceHandler.GetChapters(uint(id))
			if err != nil {
				return nil, err
			}

			return chapters, nil
		})
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, chapters)
	})

	api.GET("/chapter/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

		chapter, err, _ := s.requestGroup.Do(fmt.Sprintf("chapter/%d", id), func() (interface{}, error) {
			chapter, err := s.sourceHandler.GetChapter(uint(id))
			if err != nil {
				return nil, err
			}

			return chapter, nil
		})
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, chapter)
	})

	api.GET("/library", func(c *gin.Context) {
		mangas, err := s.libraryHandler.GetMangaFromLibrary()
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, mangas)
	})
	api.POST("/library/manga/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Query("id"), 10, 64)
		if id == 0 {
			c.AbortWithStatusJSON(400, ErrorMessage{"invalid id"})
			return
		}

		err := s.libraryHandler.SaveToLibrary(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.DELETE("/library/manga/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		if id == 0 {
			c.AbortWithStatusJSON(400, ErrorMessage{"invalid id"})
			return
		}

		err := s.libraryHandler.DeleteFromLibrary(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.GET("/history", func(c *gin.Context) {
		histories, err := s.historyHandler.GetHistories()
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}

		c.JSON(200, histories)
	})
	api.PUT("/history/chapter/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		if id == 0 {
			c.AbortWithStatusJSON(400, ErrorMessage{"invalid id"})
			return
		}

		page, _ := strconv.ParseInt(c.Query("page"), 10, 64)

		err := s.historyHandler.UpdateChapterLastPageRead(uint(id), int(page))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}

		c.Status(200)
	})
	api.GET("/update", func(c *gin.Context) {
		updates, err := s.updateHandler.GetUpdates()
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}

		c.JSON(200, updates)
	})
}

func (s *Server) Run(addr ...string) error {
	return s.r.Run(addr...)
}

package server

import (
	"strconv"

	"github.com/faldez/tanoshi/internal/source"
	"github.com/gin-gonic/gin"
)

type Server struct {
	sourceHandler *source.Handler
	r             *gin.Engine
}

func NewServer(sourceHandler *source.Handler) Server {
	r := gin.Default()
	return Server{sourceHandler, r}
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
		filters := c.QueryMap("filters")

		mangas, err := s.sourceHandler.SearchManga(c.Param("name"), filters)
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, mangas)
	})
	api.GET("/source/:name/latest", func(c *gin.Context) {
		page, _ := strconv.ParseInt(c.DefaultQuery("page", "1"), 10, 64)

		latestManga, err := s.sourceHandler.GetSourceLatestUpdates(c.Param("name"), int(page))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, latestManga)
	})
	api.GET("/source/:name/detail", func(c *gin.Context) {
		source, err := s.sourceHandler.GetSourceDetail(c.Param("name"))
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

		manga, err := s.sourceHandler.GetMangaDetails(uint(id), includeChapter)
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, manga)
	})
	api.GET("/manga/:id/chapters", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		chapters, err := s.sourceHandler.GetChapters(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, chapters)
	})
	api.PUT("/manga/:id/favorite", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		err := s.sourceHandler.SaveFavorite(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.DELETE("/manga/:id/favorite", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		err := s.sourceHandler.DeleteFavorite(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.Status(200)
	})
	api.GET("/chapter/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		chapter, err := s.sourceHandler.GetChapter(uint(id))
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, chapter)
	})
	api.PUT("/chapter/:id/read", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	api.GET("/library", func(c *gin.Context) {
		mangas, err := s.sourceHandler.GetFavoriteManga()
		if err != nil {
			c.AbortWithStatusJSON(500, ErrorMessage{err.Error()})
			return
		}
		c.JSON(200, mangas)
	})
}

func (s *Server) Run(addr ...string) error {
	return s.r.Run(addr...)
}

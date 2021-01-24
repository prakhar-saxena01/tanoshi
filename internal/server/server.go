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
		sourceList, err := s.sourceHandler.GetSourceList()
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, sourceList)
	})
	api.GET("/source/:name", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	api.GET("/source/:name/latest", func(c *gin.Context) {
		page, _ := strconv.ParseInt(c.DefaultQuery("page", "1"), 10, 64)

		latestManga, err := s.sourceHandler.GetSourceLatestUpdates(c.Param("name"), int(page))
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, latestManga)
	})
	api.GET("/source/:name/detail", func(c *gin.Context) {
		source, err := s.sourceHandler.GetSourceDetail(c.GetString("name"))
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, source)
	})
	api.GET("/manga/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		includeChapter, _ := strconv.ParseBool(c.DefaultQuery("includeChapter", "false"))

		manga, err := s.sourceHandler.GetMangaDetails(uint(id), includeChapter)
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, manga)
	})
	api.GET("/manga/:id/chapters", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		chapters, err := s.sourceHandler.GetChapters(uint(id))
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, chapters)
	})
	api.GET("/chapter/:id", func(c *gin.Context) {
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		chapter, err := s.sourceHandler.GetChapter(uint(id))
		if err != nil {
			c.AbortWithError(500, err)
			return
		}
		c.JSON(200, chapter)
	})
	api.PUT("/chapter/:id/read", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
}

func (s *Server) Run(addr ...string) error {
	return s.r.Run(addr...)
}

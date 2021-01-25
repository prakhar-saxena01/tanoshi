package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/faldez/tanoshi/internal/config"
	"github.com/faldez/tanoshi/internal/database"
	"github.com/faldez/tanoshi/internal/server"
	"github.com/faldez/tanoshi/internal/source"
)

func main() {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatalf("Can't get home directory, please provide path to config file: %s", err.Error())
	}
	var configPath *string = flag.String("config", fmt.Sprintf("%s/.config/tanoshi/config.yml", homeDir), "path to config file")
	var sourceRepoURL *string = flag.String("source_repository_url", "", "override source repository url")
	if sourceRepoURL != nil && *sourceRepoURL != "" {
		source.RepositoryURL = *sourceRepoURL
	}

	flag.Parse()

	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatalf("Error load config: %s", err.Error())
	}

	db, err := database.Open(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Error connect database: %s", err.Error())
	}

	db.AutoMigrate(&source.Source{}, &source.Manga{}, &source.Chapter{}, &source.Page{})

	repo := source.NewRepository(db)

	sourceManager, err := source.NewManager(repo)
	if err != nil {
		log.Fatalln(err.Error())
	}

	sourceHandler := source.NewHandler(sourceManager)

	srv := server.NewServer(sourceHandler)
	srv.RegisterHandler()
	srv.Run(fmt.Sprintf(":%s", cfg.Port))
}

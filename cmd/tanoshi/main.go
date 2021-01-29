package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/faldez/tanoshi/internal/config"
	"github.com/faldez/tanoshi/internal/database"
	"github.com/faldez/tanoshi/internal/history"
	"github.com/faldez/tanoshi/internal/library"
	"github.com/faldez/tanoshi/internal/server"
	"github.com/faldez/tanoshi/internal/source"
	"github.com/faldez/tanoshi/internal/update"
)

func main() {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatalf("Can't get home directory, please provide path to config file: %s", err.Error())
	}
	var configPath *string = flag.String("config", fmt.Sprintf("%s/.config/tanoshi/config.yml", homeDir), "path to config file")

	flag.Parse()

	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatalf("Error load config: %s", err.Error())
	}

	if cfg.ExtensionURL != "" && cfg.ExtensionURL != source.RepositoryURL {
		source.RepositoryURL = cfg.ExtensionURL
	}

	db, err := database.Open(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Error connect database: %s", err.Error())
	}

	db.AutoMigrate(&source.Source{}, &source.Manga{}, &source.Chapter{}, &source.Page{})

	sourceRepo := source.NewRepository(db)
	libraryRepo := library.NewRepository(db)
	historyRepo := history.NewRepository(db)
	updateRepo := update.NewRepository(db)

	sourceManager, err := source.NewManager(sourceRepo)
	if err != nil {
		log.Fatalln(err.Error())
	}

	sourceHandler := source.NewHandler(sourceManager)
	libraryHandler := library.NewHandler(libraryRepo)
	historyHandler := history.NewHandler(historyRepo)
	updateHandler := update.NewHandler(updateRepo)

	srv := server.NewServer(sourceHandler, libraryHandler, historyHandler, updateHandler)
	srv.RegisterHandler()
	log.Fatalln(srv.Run(fmt.Sprintf(":%s", cfg.Port)))
}

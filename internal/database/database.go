package database

import (
	"errors"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Open(url string) (*gorm.DB, error) {
	var dialect gorm.Dialector
	if strings.HasPrefix(url, "sqlite") {
		dialect = sqlite.Open(strings.TrimPrefix(url, "sqlite://"))
	} else if strings.HasPrefix(url, "postgres") {
		dialect = postgres.Open(url)
	} else {
		return nil, errors.New("only support sqlite and postgresql")
	}
	db, err := gorm.Open(dialect, &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})
	return db, err
}

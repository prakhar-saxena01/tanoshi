package library

import (
	"github.com/faldez/tanoshi/internal/source"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) SaveToLibrary(mangaID uint) error {
	return r.db.Model(&source.Manga{}).Where("id = ?", mangaID).Update("is_favorite", true).Error
}

func (r *Repository) DeleteFromLibrary(mangaID uint) error {
	return r.db.Model(&source.Manga{}).Where("id = ?", mangaID).Update("is_favorite", false).Error
}

func (r *Repository) GetMangaFromLibrary() ([]*source.Manga, error) {
	var mangas []*source.Manga
	err := r.db.Where("is_favorite = true").Find(&mangas).Error
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

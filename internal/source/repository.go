package source

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) SaveManga(m *Manga) (*Manga, error) {
	err := r.db.Save(m).Error
	if err != nil {
		return nil, err
	}

	return m, nil
}

func (r *Repository) SaveMangaInBatch(mangas []*Manga) ([]*Manga, error) {
	err := r.db.Clauses(clause.OnConflict{DoNothing: true}).Create(mangas).Error
	if err != nil {
		return nil, err
	}

	return mangas, nil
}

func (r *Repository) GetMangaByID(id uint, includeChapter bool) (*Manga, error) {
	var (
		manga    Manga = Manga{}
		chapters []Chapter
		err      error
	)
	manga.ID = id

	if includeChapter {
		err = r.db.Model(&manga).Association("Chapters").Find(&chapters)
		if err != nil {
			return nil, err
		}
	}
	err = r.db.First(&manga, id).Error
	if err != nil {
		return nil, err
	}
	manga.Chapters = chapters

	return &manga, nil
}

func (r *Repository) GetChaptersByMangaID(mangaID uint) ([]*Chapter, error) {
	var chapters []*Chapter
	err := r.db.Where("manga_id = ?", mangaID).Find(&chapters).Error
	if err != nil {
		return nil, err
	}

	return chapters, nil
}

func (r *Repository) GetChapterByID(id uint) (*Chapter, error) {
	var (
		chapter Chapter = Chapter{}
		pages   []*Page
	)
	chapter.ID = id

	err := r.db.Model(&chapter).Association("Pages").Find(&pages)
	if err != nil {
		return nil, err
	}

	err = r.db.First(&chapter, id).Error
	if err != nil {
		return nil, err
	}
	chapter.Pages = pages

	return &chapter, nil
}

func (r *Repository) SaveChapter(c *Chapter) (*Chapter, error) {
	err := r.db.Save(c).Error
	if err != nil {
		return nil, err
	}

	return c, nil
}

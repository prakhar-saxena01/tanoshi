package source

import (
	"fmt"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) GetSources() (map[string]*Source, error) {
	rows, err := r.db.Model(&Source{}).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sources := make(map[string]*Source)
	for rows.Next() {
		var source Source
		err := r.db.ScanRows(rows, &source)
		if err != nil {
			return nil, err
		}

		sources[strings.ToLower(source.Name)] = &source
	}

	return sources, nil
}

func (r *Repository) SaveSource(s *Source) error {
	return r.db.Save(s).Error
}

func (r *Repository) SaveSourceConfig(s *Source) error {
	return r.db.Model(s).Update("config", &s.Config).Error
}

func (r *Repository) SaveManga(m *Manga) (*Manga, error) {
	err := r.db.Save(m).Error
	if err != nil {
		return nil, err
	}

	return m, nil
}

func (r *Repository) SaveMangaInBatch(mangas []*Manga) ([]*Manga, error) {
	db := r.db.Clauses(clause.OnConflict{DoNothing: true}).Create(mangas)
	if err := db.Error; err != nil {
		return nil, err
	}

	if len(mangas) == 0 {
		return mangas, nil
	}

	if db.RowsAffected != int64(len(mangas)) {
		sqlString := "SELECT *, 0 SortOrder FROM mangas WHERE source = ? AND path = ? UNION ALL \n"
		values := []interface{}{mangas[0].Source, mangas[0].Path}
		for i := 1; i < len(mangas); i++ {
			sqlString += fmt.Sprintf("SELECT *, %d FROM mangas WHERE source = ? AND path = ? UNION ALL \n", i)
			values = append(values, mangas[i].Source, mangas[i].Path)
		}
		sqlString = strings.TrimSuffix(sqlString, "UNION ALL \n")
		sqlString += "ORDER BY SortOrder"
		if err := r.db.Raw(sqlString, values...).Scan(&mangas).Error; err != nil {
			return nil, err
		}
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

func (r *Repository) SaveFavorite(mangaID uint) error {
	return r.db.Model(&Manga{}).Update("is_favorite", true).Error
}

func (r *Repository) DeleteFavorite(mangaID uint) error {
	return r.db.Model(&Manga{}).Update("is_favorite", false).Error
}

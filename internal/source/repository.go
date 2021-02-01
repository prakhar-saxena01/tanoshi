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

		sources[source.Name] = &source
	}

	return sources, nil
}

func (r *Repository) CreateSource(s *Source) error {
	return r.db.Create(s).Error
}

func (r *Repository) UpdateSource(s *Source) error {
	return r.db.Where("name = ?", s.Name).Updates(s).Error
}

func (r *Repository) SaveSourceConfig(s *Source) error {
	langs := []string{}
	for k, v := range s.Config.Language {
		if v {
			langs = append(langs, k)
		}
	}
	tx := r.db.Begin()
	if err := tx.Model(s).Update("config", &s.Config).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Delete(&Chapter{}, "source = ? AND language NOT IN ?", s.Name, langs).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Table("chapters").Where("language IN ?", langs).Update("deleted_at", nil).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *Repository) UpdateManga(m *Manga) (*Manga, error) {
	err := r.db.Omit("is_favorite", "created_at").Updates(m).Error
	if err != nil {
		return nil, err
	}

	err = r.db.First(m).Error
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
		source    Source
		manga     Manga = Manga{}
		chapters  []Chapter
		languages []string
		err       error
	)

	err = r.db.Where("name = (?)", r.db.Table("mangas").Select("name").Where("id = ?", id)).First(&source).Error
	if err != nil {
		return nil, err
	}

	manga.ID = id

	if includeChapter {
		for lang, enabled := range source.Config.Language {
			if enabled {
				languages = append(languages, lang)
			}
		}
		err = r.db.Model(&manga).Where("language IN ?", languages).Order("rank desc").Association("Chapters").Find(&chapters)
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
	err := r.db.Updates(c).Error
	if err != nil {
		return nil, err
	}

	return c, nil
}

package history

import (
	"time"

	"github.com/faldez/tanoshi/internal/source"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) UpdateChapterLastPageRead(id uint, page int) error {
	return r.db.Model(&source.Chapter{}).Where("id = ?", id).Updates(map[string]interface{}{"last_page_read": page, "read_at": time.Now()}).Error
}

func (r *Repository) GetHistories() ([]*History, error) {
	rows, err := r.db.Table("chapters c").
		Joins("JOIN mangas m ON m.id = c.manga_id").
		Where("read_at IS NOT NULL").
		Order("read_at desc").
		Select("m.source, m.id, m.title, m.cover_url, c.id, c.number, c.Title, c.read_at, c.last_page_read").
		Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []*History
	for rows.Next() {
		var h History
		if err := rows.Scan(&h.Source, &h.MangaID, &h.MangaTitle, &h.CoverURL, &h.ChapterID, &h.ChapterNumber, &h.ChapterTitle, &h.ReadAt, &h.LastPageRead); err != nil {
			return nil, err
		}

		history = append(history, &h)
	}

	return history, nil
}

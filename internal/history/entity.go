package history

import "time"

type History struct {
	Source        string
	MangaID       string
	MangaTitle    string
	CoverURL      string
	ChapterID     string
	ChapterNumber string
	ChapterTitle  string
	ReadAt        time.Time
	LastPageRead  int
}

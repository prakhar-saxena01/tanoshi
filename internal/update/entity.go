package update

import "time"

type Update struct {
	Source        string
	MangaID       string
	MangaTitle    string
	CoverURL      string
	ChapterID     string
	ChapterNumber string
	ChapterTitle  string
	UploadedAt    time.Time
	IsRead        bool
}

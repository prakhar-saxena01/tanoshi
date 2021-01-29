package library

import "github.com/faldez/tanoshi/internal/source"

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo}
}

func (h *Handler) SaveToLibrary(mangaID uint) error {
	return h.repo.SaveToLibrary(mangaID)
}

func (h *Handler) DeleteFromLibrary(mangaID uint) error {
	return h.repo.DeleteFromLibrary(mangaID)
}

func (h *Handler) GetMangaFromLibrary() ([]*source.Manga, error) {
	return h.repo.GetMangaFromLibrary()
}

package source

type Handler struct {
	sm *Manager
}

func NewHandler(sm *Manager) *Handler {
	return &Handler{sm}
}

func (h *Handler) GetSourceList() ([]*Source, error) {
	return h.sm.List(), nil
}

func (h *Handler) GetSourceDetail(name string) (*Source, error) {
	return h.sm.Get(name), nil
}

func (h *Handler) GetSourceLatestUpdates(name string, page int) ([]*Manga, error) {
	return h.sm.GetLatestUpdates(name, page)
}

func (h *Handler) GetMangaDetails(id uint, includeChapter bool) (*Manga, error) {
	return h.sm.GetMangaDetails(id, includeChapter)
}

func (h *Handler) GetChapters(mangaID uint) ([]*Chapter, error) {
	return h.sm.GetChapters(mangaID)
}

func (h *Handler) GetChapter(id uint) (*Chapter, error) {
	return h.sm.GetChapter(id)
}

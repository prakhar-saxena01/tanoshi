package history

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}
func (h *Handler) UpdateChapterLastPageRead(id uint, page int) error {
	return h.repo.UpdateChapterLastPageRead(id, page)
}

func (h *Handler) GetHistories(page, limit int) ([]*History, error) {
	return h.repo.GetHistories(page, limit)
}

package update

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) GetUpdates(page int, limit int) ([]*Update, error) {
	return h.repo.GetUpdates(page, limit)
}

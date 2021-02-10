package source

type Handler struct {
	sm *Manager
}

func NewHandler(sm *Manager) *Handler {
	return &Handler{sm}
}

func (h *Handler) GetSourcesFromRemote() ([]SourceInterface, error) {
	return h.sm.GetSourcesFromRemote()
}

func (h *Handler) InstallSource(name string) error {
	return h.sm.InstallSource(name)
}

func (h *Handler) UpdateSource(name string) error {
	return h.sm.UpdateSource(name)
}

func (h *Handler) GetSourceList() ([]SourceInterface, error) {
	return h.sm.List()
}

func (h *Handler) GetSourceDetail(name string) (SourceInterface, error) {
	return h.sm.Get(name), nil
}

func (h *Handler) GetSourceConfig(name string) (*Config, error) {
	return h.sm.GetSourceConfig(name)
}

func (h *Handler) UpdateSourceConfig(name string, c *Config) error {
	return h.sm.UpdateSourceConfig(name, c)
}

func (h *Handler) GetSourceFilters(name string) ([]*FilterField, error) {
	return h.sm.GetSourceFilters(name)
}

func (h *Handler) GetSourceLatestUpdates(name string, page int) ([]*Manga, error) {
	return h.sm.GetLatestUpdates(name, page)
}

func (h *Handler) SearchManga(name string, filter Filter) ([]*Manga, error) {
	return h.sm.SearchManga(name, filter)
}

func (h *Handler) GetMangaDetails(id uint, includeChapter bool, refresh bool) (*Manga, error) {
	return h.sm.GetMangaDetails(id, includeChapter, refresh)
}

func (h *Handler) GetChapters(mangaID uint) ([]*Chapter, error) {
	return h.sm.GetChapters(mangaID)
}

func (h *Handler) GetChapter(id uint) (*Chapter, error) {
	return h.sm.GetChapter(id)
}

func (h *Handler) Login(name, username, password, twoFactor string, remember bool) error {
	return h.sm.Login(name, username, password, twoFactor, remember)
}

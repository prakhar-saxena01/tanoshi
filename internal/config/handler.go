package config

type Handler struct {
	cfg *Config
}

func NewHandler(cfg *Config) *Handler {
	return &Handler{}
}

func (h *Handler) GetConfig() (*Config, error) {
	return h.cfg, nil
}

func (h *Handler) SaveConfig(cfg *Config) error {
	err := cfg.Save()
	if err != nil {
		return err
	}

	h.cfg = cfg
	return nil
}

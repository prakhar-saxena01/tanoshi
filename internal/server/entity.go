package server

type ErrorMessage struct {
	Message string
}

type Pagination struct {
	Page  int `form:"page"`
	Limit int `form:"limit"`
}

type LoginRequest struct {
	Username, Password, TwoFactor string
	Remember                      bool
}

type SearchSourceRequest struct {
	Title string `form:"title"`
	Page  int    `form:"page"`
}

type GetHistoryRequest struct {
	Pagination
}

type UpdateHistoryRequest struct {
	Page int `form:"page"`
}

type SearchLibraryRequest struct {
	Title string `form:"title"`
	Pagination
}

type GetUpdateRequest struct {
	Pagination
}

type ProxyRequest struct {
	URL string `form:"url"`
}

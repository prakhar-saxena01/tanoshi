package server

type GetLatestUpdatesRequest struct {
	Page int
}

type GetMangaDetailsRequest struct {
	IncludeChapter bool
}

type LoginRequest struct {
	Username, Password, TwoFactor string
	Remember                      bool
}

package server

type ErrorMessage struct {
	Message string
}

type LoginRequest struct {
	Username, Password, TwoFactor string
	Remember                      bool
}

package webview

import (
	"runtime"

	"github.com/webview/webview"
)

type Webview struct {
	w webview.WebView
}

func NewWebview() Webview {
	debug := true
	w := webview.New(debug)
	w.SetTitle("Minimal webview example")
	w.SetSize(800, 600, webview.HintNone)
	w.Navigate("http://localhost:8080")

	if runtime.GOOS == "darwin" {
		window := NSWindow{w.Window()}
		window.Center()
	}
	return Webview{w}
}

func (w *Webview) Run() {
	defer w.w.Destroy()
	w.w.Run()
}

package webview

import (
	"github.com/webview/webview"
)

var w webview.WebView

func init() {
	debug := true
	w = webview.New(debug)
	w.SetTitle("Tanoshi")
	w.SetSize(800, 600, webview.HintNone)
}

func Run(addr string) {
	defer w.Destroy()
	w.Navigate(addr)
	w.Run()
}

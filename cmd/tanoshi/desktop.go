// +build desktop

package main

import (
	"fmt"
	"log"

	"github.com/webview/webview"
)

func main() {
	go func() {
		err := srv.Run(fmt.Sprintf(":%s", cfg.Port))
		log.Fatalln(err)
	}()

	debug := true
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("Tanoshi")
	w.SetSize(1280, 800, webview.HintNone)
	w.Navigate(fmt.Sprintf("http://localhost:%s", cfg.Port))
	w.Run()
}

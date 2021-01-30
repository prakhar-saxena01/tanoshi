// +build desktop,darwin

package webview

// #cgo CFLAGS: -x objective-c
// #cgo LDFLAGS: -framework Cocoa
//#include "ns_window.h"
import "C"
import "unsafe"

type NSWindow struct {
	ptr unsafe.Pointer
}

func (self *NSWindow) Center() {
	C.Center(self.ptr)
}

func init() {
	window := &NSWindow{w.Window()}
	window.Center()
}

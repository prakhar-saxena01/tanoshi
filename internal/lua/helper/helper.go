package helper

import (
	"time"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

type Helper struct{}

func NewHelper() *Helper {
	return &Helper{}
}

func (h *Helper) Loader(L *lua.LState) int {
	mod := L.SetFuncs(L.NewTable(), map[string]lua.LGFunction{
		"timestamp_to_time": h.timestampToTime,
	})

	L.Push(mod)
	return 1
}

func (h *Helper) timestampToTime(L *lua.LState) int {
	timestamp := L.ToInt64(1)
	L.Push(luar.New(L, time.Unix(timestamp, 0)))
	return 1
}

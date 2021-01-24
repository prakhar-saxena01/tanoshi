package scraper

import (
	"strings"

	"github.com/antchfx/htmlquery"
	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

type HtmlScraper struct{}

func NewHTMLScraper() *HtmlScraper {
	return &HtmlScraper{}
}

func (h *HtmlScraper) Loader(L *lua.LState) int {
	L.SetGlobal(luaHtmlNodeTypeName, luar.NewType(L, HtmlNode{}))

	mod := L.SetFuncs(L.NewTable(), map[string]lua.LGFunction{
		"parse":    h.parse,
		"find":     h.find,
		"find_one": h.findOne,
	})

	L.Push(mod)
	return 1
}

func (h *HtmlScraper) parse(L *lua.LState) int {
	body := L.ToString(1)
	doc, err := htmlquery.Parse(strings.NewReader(body))
	if err != nil {
		L.Push(lua.LNil)
		L.Push(lua.LString(err.Error()))
		return 2
	}
	L.Push(luar.New(L, HtmlNode{doc}))
	L.Push(lua.LNil)
	return 2
}

func (h *HtmlScraper) find(L *lua.LState) int {
	doc := L.ToUserData(1)
	xpath := L.ToString(2)

	if v, ok := doc.Value.(HtmlNode); ok {
		list := htmlquery.Find(v.node, xpath)

		var nodes []HtmlNode
		for i := range list {
			nodes = append(nodes, HtmlNode{list[i]})
		}

		L.Push(luar.New(L, nodes))
		L.Push(lua.LNil)
		return 2
	}
	L.Push(lua.LNil)
	L.Push(lua.LString("HtmlNode expected"))
	return 2
}

func (h *HtmlScraper) findOne(L *lua.LState) int {
	doc := L.ToUserData(1)
	xpath := L.ToString(2)

	if v, ok := doc.Value.(HtmlNode); ok {
		node := htmlquery.FindOne(v.node, xpath)

		L.Push(luar.New(L, HtmlNode{node}))
		L.Push(lua.LNil)
		return 2
	}
	L.Push(lua.LNil)
	L.Push(lua.LString("HtmlNode expected"))
	return 2
}

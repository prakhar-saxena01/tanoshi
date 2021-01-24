package scraper

import (
	"github.com/antchfx/htmlquery"
	"golang.org/x/net/html"
)

type HtmlNode struct {
	node *html.Node
}

const luaHtmlNodeTypeName = "HtmlNode"

func (n HtmlNode) SelectAttr(name string) string {
	return htmlquery.SelectAttr(n.node, name)
}

func (n HtmlNode) InnerText() string {
	return htmlquery.InnerText(n.node)
}

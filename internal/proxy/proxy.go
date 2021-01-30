package proxy

import (
	"io/ioutil"
	"net/http"
)

type Proxy struct {
}

func NewProxy() *Proxy {
	return &Proxy{}
}

func (p *Proxy) Get(url string) ([]byte, string, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer res.Body.Close()

	contentType := res.Header.Get("Content-Type")
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, "", err
	}

	return data, contentType, nil
}

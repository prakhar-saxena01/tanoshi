package proxy

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/mholt/archiver/v3"
)

type Proxy struct {
}

func NewProxy() *Proxy {
	return &Proxy{}
}

func (p *Proxy) Get(url string) ([]byte, string, error) {
	if strings.HasPrefix(url, "/") {
		archivePath := path.Dir(url)
		filePath := path.Base(url)
		targetPath := path.Join(os.TempDir(), filePath)

		if err := archiver.DefaultZip.Extract(archivePath, filePath, os.TempDir()); err != nil {
			return nil, "", err
		}
		defer os.RemoveAll(targetPath)

		data, err := ioutil.ReadFile(path.Join(targetPath, filePath))
		if err != nil {
			return nil, "", err
		}

		return data, fmt.Sprintf("image/%s", path.Ext(filePath)), nil
	}

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

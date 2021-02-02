package source_test

import (
	"fmt"
	"testing"

	"github.com/faldez/tanoshi/internal/source"
)

func TestLocalGetLatestUpdates(t *testing.T) {
	s := source.NewLocal("/Users/fadhlika/Downloads/Manga")

	manga, _ := s.GetLatestUpdates(1)
	for _, m := range manga {
		fmt.Printf("manga: %v\n", m)
	}
}

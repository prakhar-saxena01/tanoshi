// +build headless

package main

import (
	"fmt"
	"log"
)

func main() {
	err := srv.Run(fmt.Sprintf(":%s", cfg.Port))
	log.Fatalln(err)
}

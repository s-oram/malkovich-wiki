package livereload

import (
	log "github.com/Sirupsen/logrus"
	"github.com/jaschaephraim/lrserver"
	"github.com/s-oram/go-spotter"
	"path/filepath"
	"strings"
)

func Init() {
	lr, err := lrserver.New(lrserver.DefaultName, lrserver.DefaultPort)
	if err != nil {
		panic(err.Error())
	}

	// Start the server!
	go func() {
		err = lr.ListenAndServe()
		if err != nil {
			log.Errorf("LiveReload Error: %s", err.Error())
		}
	}()

	watcher, err := spotter.New()
	if err != nil {
		panic(err.Error())
	}

	// TODO:MED the watch directory is hardcoded here.
	WebRoot := `C:\GoHomeDir\src\MicroNote\www\public`
	watcher.SourceDir = WebRoot
	watcher.EventHandler = func(Name string, EventType spotter.FsEventType) {
		//TODO:MED should check for file extensions and only send
		// reload requests for certain files.
		fn := strings.TrimPrefix(Name, WebRoot)
		fn = filepath.ToSlash(fn)
		lr.Reload(fn)
		log.Infof("[LR] Modified: %s", fn)
	}
	err = watcher.Start()
	if err != nil {
		panic(err.Error())
	}

}

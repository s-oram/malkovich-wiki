package malkovich

// file permission summary here
// http://stackoverflow.com/a/31151508/395461

import (
	"errors"
	"runtime"
	//log "github.com/Sirupsen/logrus"
	"path/filepath"
	//"github.com/luisiturrios/gowin"
	"github.com/mitchellh/go-homedir"
	"os"
	"strings"
)

// TODO:MED Perhaps these methods need to be renamed.
// "FolderName" is wrong. It should be something like
// "EncodePageNameForFileSystem"
func FolderNameToDocName(x string) string {
	name := strings.Replace(x, "_", " ", -1)
	return name
}

func DocNameToFolderName(x string) string {
	name := strings.Replace(x, " ", "_", -1)
	return name
}

func GetUserDataDirectory() (string, error) {
	var x string
	var err error

	switch runtime.GOOS {
	case "windows":
		x = os.Getenv(`AppData`)
		if x == "" {
			return "", errors.New(`The "AppData" environment variable is empty.`)
		}
	case "darwin":
		x, _ = homedir.Dir()
		if x == "" {
			return "", errors.New(`The home directory could not be found.`)
		}
	default:
		return "", errors.New("Current platform is not supported. Cannot locate user data directory.")

	}

	Dir := filepath.Join(x, "Malkovich")
	err = os.MkdirAll(Dir, 0755)
	if err != nil {
		return "", errors.New(`Unable to create "Malkovich" data directory.`)
	}
	return Dir, nil
}

func GetUserDocsDirectory() (string, error) {
	DataDir, err := GetUserDataDirectory()
	if err != nil {
		return "", err
	}
	DocsDir := filepath.Join(DataDir, "Docs")
	err = os.MkdirAll(DocsDir, 0755)
	if err != nil {
		return "", errors.New(`Unable to create "Docs" directory. ` + err.Error())
	}
	return DocsDir, nil
}

func GetWikiPageDirectory(PageName string) (string, error) {
	DocsDir, err := GetUserDocsDirectory()
	if err != nil {
		return "", err
	}
	PageDir := filepath.Join(DocsDir, `pages`, DocNameToFolderName(PageName))
	return PageDir, nil
}

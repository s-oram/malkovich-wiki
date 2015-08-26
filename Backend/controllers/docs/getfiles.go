package docs

/*
   Here are functions that return paths to "document/page" file resources.
*/

import (
	"MicroNote/system/malkovich"
	"path"
	"path/filepath"
)

func getDocDirectory(DocRoot, DocName string) string {
	// TODO:HIGH probably need to do some validation of the doc name.
	DocFolderName := malkovich.DocNameToFolderName(DocName)
	fp := path.Join(DocRoot, "pages", DocFolderName)
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)
	return fp
}

func getDocTextFilePath(DocRoot, DocName string) string {
	// TODO:HIGH probably need to do some validation of the doc name.
	DocFolderName := malkovich.DocNameToFolderName(DocName)
	fp := path.Join(DocRoot, "pages", DocFolderName, "index.md")
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)
	//TODO:HIGH ensure the file is contained under the DocRoot.
	return fp
}

func getDocPreviewFilePath(DocRoot, DocName string) string {
	// TODO:HIGH probably need to do some validation of the doc name.
	DocFolderName := malkovich.DocNameToFolderName(DocName)
	fp := path.Join(DocRoot, "pages", DocFolderName, "page_summary.json")
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)
	//TODO:HIGH ensure the file is contained under the DocRoot.
	return fp
}

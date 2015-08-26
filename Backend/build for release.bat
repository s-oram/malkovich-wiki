:: Guide to windows batch file scripting.
:: http://steve-jansen.github.io/guides/windows-batch-scripting/part-2-variables.html

:: X-copy flags.
:: http://stackoverflow.com/a/986505/395461


SETLOCAL

::Build the front end
::cd www
::hugo 
::cd ..

::Build the server
::go build -ldflags -H=windowsgui server.go
go build -ldflags "-H windowsgui"


:: copy "www" files 
SET src="C:\GoHomeDir\src\MicroNote\www\public"
SET dst="C:\GoHomeDir\src\MicroNote\_installer\bin\www\public"
IF EXIST %dst% (
    rmdir %dst% /s /q
)
IF NOT EXIST %dst% (
	mkdir %dst%
)
xcopy /s/e/v %src% %dst%





:: copy MicroNote executable.
SET src="C:\GoHomeDir\src\MicroNote\MicroNote.exe"
SET dst="C:\GoHomeDir\src\MicroNote\_installer\bin\Malkovich.exe"
copy /y/v %src% %dst%
del %src%

ENDLOCAL
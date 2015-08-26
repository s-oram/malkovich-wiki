:: Windows Batch Scripting Notes.
:: http://steve-jansen.github.io/guides/windows-batch-scripting/part-2-variables.html

:: Golang Node-Webkit. 
:: http://godoc.org/github.com/lonnc/golang-nw


::IMPORTANT Call SETLOCAL at beginning of script.
SETLOCAL


:: update the www source files. 
cd www
hugo
cd ..


:: build the server application.
go build



:: copy www files to the built runtime locoation
SET src="C:\GoHomeDir\src\MicroNote\www\public"
SET dst="C:\Bin\Malkovich\www\public"
IF EXIST %dst% (
    rmdir %dst% /s /q
)
IF NOT EXIST %dst% (
	mkdir %dst%
)
xcopy /s/e/v %src% %dst%


:: Package into Note webkit application.

SET Packer=C:\GoHomeDir\bin\golang-nw-pkg.exe
SET SourceApp=C:\GoHomeDir\src\MicroNote\MicroNote.exe
SET AppName=Malkovich
SET TargetFileName=Malkovich.exe
SET NWCacheDir=C:\Bin\NodeWebkitCache
SET OutputDir=C:\Bin\Malkovich
::SET NWVersion=v0.8.0
::SET NWVersion=v0.10.0
::SET NWVersion=v0.11.4
SET NWVersion=v0.11.5
::SET NWVersion=v0.11.6
::SET NWVersion=v0.12.2

%Packer% -version="%NWVersion%" -app="%SourceApp%" -name="%AppName%" -bin="%TargetFileName%" -binDir="%OutputDir%" -cacheDir="%NWCacheDir%" -toolbar=true  





::IMPORTANT Call ENDLOCAL at end of script.
ENDLOCAL
SETLOCAL

SET OutputJS=C:\GoHomeDir\src\MicroNote\www\source\js\concated.js

TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\lib\standard.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\lib\ajax_utils.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\lib\strings.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery-1.11.2.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.serialize-object.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.wait.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.ajax-form.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.hotkeys.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.filebrowser.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\jquery.insertAtCaret.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\bootstrap\bootstrap.min.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\interact\interact.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\venobox\venobox.min.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\mustache\mustache.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\filedrop\filedrop.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\sprintf\sprintf.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\mozilla\cookie.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\golib\path-filepath.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\vendor\vam\querystringinterface\querystringinterface.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\static\vendor\masonry\masonry.pkgd.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\source\js\config.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\static\widgets\filebrowser\comp.filebrowser.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\static\widgets\popup_dialog\MessageDialog.js" >> "%OutputJS%"
TYPE "C:\GoHomeDir\src\MicroNote\www\static\widgets\popup_dialog\PopupDialogs.js" >> "%OutputJS%"



ENDLOCAL
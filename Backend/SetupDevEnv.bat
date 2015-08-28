:: Start the node LiveReload server for the frontend.
cd ../Frontend
start cmd /k node dev_server
cd ../Backend

:: Start the riotjs tag compiler. (It watches for tag changes.)
cd ../Frontend
start cmd /k riot -w --type es6 source/tags public/tags
cd ../Backend

:: Start fswatch. Go server will restart on changes.
start cmd /k fswatch

:: Start Koala for SCSS compilation
start "" "C:\Program Files (x86)\Koala\koala.exe"


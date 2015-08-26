:: Start the node LiveReload server for the frontend.
cd www
start cmd /k node dev_server
cd ..

:: Start the riotjs tag compiler. (It watches for tag changes.)
cd www
start cmd /k riot -w --type es6 public/tags
cd ..

:: Start fswatch. Go server will restart on changes.
start cmd /k fswatch

:: Start Koala for SCSS compilation
start "" "C:\Program Files (x86)\Koala\koala.exe"


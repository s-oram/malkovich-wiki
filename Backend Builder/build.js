"use strict"

var path = require('path');
var fs = require('fs.extra');
var syncfs = require('fs-sync');

require('shelljs/global');

// Change the working directory. 
var MalkovichServerSourceDir = path.resolve('c:', 'GoHomeDir', 'src', 'MicroNote');	
cd(MalkovichServerSourceDir);


// Build the server. 
console.log('Building the server...');
exec('go build -ldflags "-H windowsgui"');

var Source = path.resolve(MalkovichServerSourceDir, 'MicroNote.exe');
var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'Malkovich.exe');	
syncfs.remove(Dest);
cp(Source, Dest);


console.log('Building the server...');
exec('go build');

var Source = path.resolve(MalkovichServerSourceDir, 'MicroNote.exe');
var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'MalkovichCLI.exe');	
syncfs.remove(Dest);
cp(Source, Dest);



console.log('==script complete==');









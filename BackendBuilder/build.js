"use strict"

var path = require('path');
var fs = require('fs.extra');
var syncfs = require('fs-sync');
require('shelljs/global');

// Change the working directory. 
var MalkovichServerSourceDir = path.resolve('c:', 'GoHomeDir', 'src', 'MicroNote');	
cd(MalkovichServerSourceDir);


// Build the server. 
//console.log('Building the server...');
//exec('go build -ldflags "-H windowsgui"');


(function(){	
	var commandA;
	var commandB;
	var platform = 'windows';
	var arch = '386';
	
	commandA = 'env GOOS={PLAT} GOARCH={ARCH} go build -o _bin/{PLAT}/{ARCH}/MalkovichCLI.exe'
	commandA = commandA.replace('{PLAT}', platform);
	commandA = commandA.replace('{PLAT}', platform);
	commandA = commandA.replace('{ARCH}', arch);
	commandA = commandA.replace('{ARCH}', arch);	

	commandB = 'env GOOS={PLAT} GOARCH={ARCH} go build -o _bin/{PLAT}/{ARCH}/Malkovich.exe -ldflags "-H windowsgui"';
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{ARCH}', arch);
	commandB = commandB.replace('{ARCH}', arch);	

	//exec('env GOOS=windows GOARCH=386 go build -o _bin/windows/386/MalkovichCLI.exe');
	console.log('Building server for windows...');	
	exec(commandA);
	console.log('Building CLI server for windows...');	
	exec(commandB);
}.call());


(function(){	
	var commandA;
	var commandB;
	var platform = 'darwin';
	var arch = '386';

	commandA = 'env GOOS={PLAT} GOARCH={ARCH} go build -o _bin/{PLAT}/{ARCH}/MalkovichCLI'
	commandA = commandA.replace('{PLAT}', platform);
	commandA = commandA.replace('{PLAT}', platform);
	commandA = commandA.replace('{ARCH}', arch);
	commandA = commandA.replace('{ARCH}', arch);	

	commandB = 'env GOOS={PLAT} GOARCH={ARCH} go build -o _bin/{PLAT}/{ARCH}/Malkovich -ldflags "-H windowsgui"';
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{ARCH}', arch);
	commandB = commandB.replace('{ARCH}', arch);	

	//exec('env GOOS=windows GOARCH=386 go build -o _bin/windows/386/MalkovichCLI.exe');
	console.log('Building server for OSX...');	
	exec(commandA);
	console.log('Building CLI server for OSX...');	
	exec(commandB);
}.call());

return;

var Source ='';
var Dest = '';




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
"use strict"

var path = require('path');
var fs = require('fs.extra');
var syncfs = require('fs-sync');
var shell = require('shelljs');

// Change the working directory. 
var MalkovichServerSourceDir = path.resolve(__dirname, '..', 'Backend')
shell.cd(MalkovichServerSourceDir);

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

	
	console.log('Building server for windows...');	
	shell.exec(commandA);
	console.log('Building CLI server for windows...');	
	shell.exec(commandB);
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

	commandB = 'env GOOS={PLAT} GOARCH={ARCH} go build -o _bin/{PLAT}/{ARCH}/Malkovich';
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{PLAT}', platform);
	commandB = commandB.replace('{ARCH}', arch);
	commandB = commandB.replace('{ARCH}', arch);	
	
	console.log('Building server for OSX...');	
	shell.exec(commandA);
	console.log('Building CLI server for OSX...');	
	shell.exec(commandB);
}.call());



var Source;
var Dest;


//==== Copy windows files to install directory =====
Source = path.resolve(MalkovichServerSourceDir, '_bin/windows/386/Malkovich.exe');
Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'Malkovich.exe');	
syncfs.remove(Dest);
shell.cp(Source, Dest);

Source = path.resolve(MalkovichServerSourceDir, '_bin/windows/386/MalkovichCLI.exe');
Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'MalkovichCLI.exe');	
syncfs.remove(Dest);
shell.cp(Source, Dest);

//==== Copy OSX files to install directory =====
Source = path.resolve(MalkovichServerSourceDir, '_bin/darwin/386/Malkovich');
Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Darwin', 'Malkovich');	
syncfs.remove(Dest);
shell.cp(Source, Dest);
//shell.chmod('+x', Dest);

Source = path.resolve(MalkovichServerSourceDir, '_bin/darwin/386/MalkovichCLI');
Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Darwin', 'MalkovichCLI');	
syncfs.remove(Dest);
shell.cp(Source, Dest);
//shell.chmod('+x', Dest);

//==== Copy OSX files to Mac Share directory =====
Source = path.resolve(MalkovichServerSourceDir, '_bin/darwin/386/Malkovich');
Dest = 'Z:/OSX Share/Malkovich/Malkovich';	
syncfs.remove(Dest);
shell.cp(Source, Dest);
//shell.chmod('+x', Dest);

Source = path.resolve(MalkovichServerSourceDir, '_bin/darwin/386/MalkovichCLI');
Dest = 'Z:/OSX Share/Malkovich/MalkovichCLI';	
syncfs.remove(Dest);
shell.cp(Source, Dest);
//shell.chmod('+x', Dest);



console.log('==script complete==');
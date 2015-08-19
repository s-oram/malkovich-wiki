"use strict"

var WindowsElectronDir = 'electron-v0.30.4-win32-ia32';
var ClientAppDir = 'ClientApp';

console.log('Building Malkovich Client');

var path = require('path');
var tinylr = require('tiny-lr');
var fs = require('fs.extra');
var syncfs = require('fs-sync');


//==== Build the windows client app ====
(function(){	
	var ElectronDir = path.resolve(__dirname, WindowsElectronDir);

	// Rename the executable.
	var Source = path.resolve(ElectronDir, 'electron.exe');
	var Dest = path.resolve(ElectronDir, 'Malovich Client.exe');
	if (fs.existsSync(Dest) == false){
		fs.renameSync(Source, Dest);		
	}	

	// Copy the application files.
	console.log('Copy application files...');
	var Source = path.resolve(__dirname, ClientAppDir);
	var Dest = path.resolve(ElectronDir, 'resources', 'app');
	syncfs.remove(Dest);
	syncfs.copy(Source, Dest, null);


	// Copy the prepared Client wrapper files to install directory...
	console.log('Copy files to install directory...');
	var Source = ElectronDir;
	var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'Client');
	//console.log(Source);
	//console.log(Dest);
	syncfs.remove(Dest);
	syncfs.copy(Source, Dest, null);


	console.log('==script complete==');


}.call())
//==================================================








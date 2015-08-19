"use strict"

var WindowsElectronDir = 'electron-v0.30.4-win32-ia32';
var ClientAppDir = 'ClientApp';

console.log('Building Malkovich Client');

var path = require('path');
var fs = require('fs.extra');
var fsExtra = require('node-fs-extra');
var syncfs = require('fs-sync');

require('shelljs/global');


//==== Build the windows client app ====
(function(){	
	var ElectronDir = path.resolve(__dirname, WindowsElectronDir);	

	// Copy the application files.
	console.log('Copy application files...');
	var Source = path.resolve(__dirname, ClientAppDir);
	var Dest = path.resolve(ElectronDir, 'resources', 'app');
	syncfs.remove(Dest);
	syncfs.copy(Source, Dest, null);

	// Copy the prepared Client wrapper files to install directory...
	console.log('Copy files to install directory...');
	var Source = path.resolve(ElectronDir);
	var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'client');	
	syncfs.remove(Dest);
	fsExtra.copySync(Source, Dest);

	

	// Rename the executable.	
	console.log('Rename the executable...')
	var Source = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'client', 'electron.exe');
	var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'client', 'Malkovich Client.exe');	
	fsExtra.copySync(Source, Dest);
	fs.unlink(Source);	


	console.log('==script complete==');


}.call())
//==================================================








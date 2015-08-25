"use strict"

var shell = require('shelljs');
var util = require('util');

console.log('Building the Windows Installer...');

var InnoSetupCompiler = 'C:/Program Files (x86)/Inno Setup 5/Compil32.exe';
var SetupScript = 'D:/MalkovichProjectFiles/WindowsInstaller/Install.iss';
var Command = util.format('"%s" /cc "%s"', InnoSetupCompiler, SetupScript);
shell.exec(Command);

console.log('==script complete==');
"use strict"

console.log('==Building Frontend Files==');

var path = require('path');
var fs = require('fs.extra');
var syncfs = require('fs-sync');


// TODO:MED Right now we are only copying the
// generated files from the public directory.
// The build step should also compile all
// the Riotjs tags and scss files. 

console.log('Copying files to install directory.')
var Source = "C:/GoHomeDir/src/MicroNote/www/public";
var Dest = path.resolve(__dirname, '..', '_bin', 'Malkovich Windows', 'www', 'public');
syncfs.remove(Dest);
syncfs.copy(Source, Dest, null);


console.log('==script complete==');
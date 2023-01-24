"use strict";
const routerFile = require('express').Router();
const fs = require('fs');
const pathFiles = require('path');
const soundsDir = pathFiles.join(pathFiles.resolve(__dirname, '..'), '/sounds/Instruments');
routerFile.get('/sounds/Instruments', (req, res) => {
    function traverseFolder(folderPath) {
        const fileStruct = {};
        const nonFolders = [];
        const files = fs.readdirSync(folderPath);
        files.forEach((file) => {
            if (fs.lstatSync(pathFiles.join(folderPath, file)).isDirectory()) {
                fileStruct[file] = traverseFolder(pathFiles.resolve(folderPath, file));
            }
            else if (file.substring(file.length - 5) === '.webm') {
                nonFolders.push(file.substring(0, file.length - 5));
            }
        });
        return (Object.keys(fileStruct).length === 0) ? nonFolders : fileStruct;
    }
    try {
        const fileStruct = traverseFolder(pathFiles.resolve(soundsDir));
        console.log(fileStruct);
        res.status(200);
        res.send(fileStruct);
    }
    catch (err) {
        console.error(err);
    }
});
module.exports = routerFile;

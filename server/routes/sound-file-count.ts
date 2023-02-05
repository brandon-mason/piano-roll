const soundFileRouter = require('express').Router();
const fs = require('fs');
const soundPath = require('path')
const soundsDir = soundPath.join(soundPath.resolve(__dirname, '..'), '/sounds/Instruments');

soundFileRouter.get('/sounds/Instruments', (req: any, res: any) => {
  function traverseFolder(folderPath: string) {
    const fileStruct: any = {};
    const nonFolders: string[] = [];
    const files = fs.readdirSync(folderPath);
    files.forEach((file: string) => {
      if(fs.lstatSync(soundPath.join(folderPath, file)).isDirectory()) {
        fileStruct[file] = traverseFolder(soundPath.resolve(folderPath, file));
      } else if(file.substring(file.length - 5) === '.webm') {
        nonFolders.push(file.substring(0, file.length - 5));
      }
    });
    return (Object.keys(fileStruct).length === 0) ? nonFolders : fileStruct;
  }

  const fileStruct = traverseFolder(soundPath.resolve(soundsDir));
  // console.log(fileStruct)
  res.status(200);
  res.send(fileStruct);
});

module.exports = soundFileRouter;

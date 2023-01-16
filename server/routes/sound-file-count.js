const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const soundsDir = path.join(path.resolve(__dirname, '..'), '/sounds/Instruments');

function countFiles(soundPath) {
  var count = 0;
  
}

function traverseFiles(soundPath) {
  const files = fs.readdirSync(soundPath)
    var count = 0;
    var directories = [];
    files.forEach((file) => {
      // console.log(file)
      if(file.substring(file.length - 4) === 'webm') count++;
      else if(fs.lstatSync(path.join(soundPath, file)).isDirectory()) {
        directories.push(path.join(soundPath, file));
      } else if(directories.length === 0) {
        // console.log('count',count)
        return count;
      }
    });
    directories.forEach((directory) => {
      // console.log('//////////////////////////////////////////////////////////////////////')
      // console.log('t', traverseFiles(directory));
      count += traverseFiles(directory);
    });
}

// router.get('/sounds/:sound', (req, res) => {

//   function traverseFile(soundPath) {
//     const files = fs.readdirSync(soundPath);
//     var count = 0;
//     var directories = [];
//     files.forEach((file) => {
//       if(file.substring(file.length - 4) === 'webm') {
//         count++;
//       } else if(fs.lstatSync(path.join(soundPath, file)).isDirectory()) {
//         directories.push(path.join(soundPath, file));
//         return 0;
//       }
//     });
//     if(directories.length !== 0) {
//       directories.forEach((directory) => {
//         count += traverseFile(directory);
//       });
//     }
//     return count;
//   }

//   // console.log('tranns', traverseFile(path.join(soundPath, req.params.sound)))

//   res.send(200);
//   res.send(traverseFile(path.join(soundPath, req.params.sound)));
// })
// router.get('/sounds/:sound', (req, res) => {
//   var octavesPath = path.join(soundsDir, req.params.sound)
//   const files = fs.readdirSync(octavesPath);
//   var count = 0;
//   files.forEach((file) => {
//     if(fs.lstatSync(path.join(octavesPath, file)).isDirectory()) {
//       count++;
//     }
//   });
  

//   console.log('tranns', count)

//   res.status(200);
//   res.send(JSON.stringify(count));
// })
router.get('/sounds/Instruments', (req, res) => {
  function traverseFolder(folderPath) {
    const fileStruct = {};
    const nonFolders = [];
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      if(fs.lstatSync(path.join(folderPath, file)).isDirectory()) {
        fileStruct[file] = traverseFolder(path.resolve(folderPath, file));
      } else if(file.substring(file.length - 5) === '.webm') {
        nonFolders.push(file.substring(0, file.length - 5));
      }
    });
    return (Object.keys(fileStruct).length === 0) ? nonFolders : fileStruct;
  }

  const fileStruct = traverseFolder(path.resolve(soundsDir));
  // console.log(fileStruct)
  res.status(200);
  res.send(fileStruct);
});

module.exports = router;

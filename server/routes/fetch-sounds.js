const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const zlib = require('node:zlib');
const archiver = require('archiver');

const soundPath = path.join(path.resolve(__dirname, '..'), '/sounds');

router
  .get('/api/sounds/:sound/:octave/:volume', async (req, res) => {
    try {
      var folderPath = path.join(soundPath, req.params.sound, req.params.octave, req.params.volume);
      var options = {
        root: path.join(soundPath, req.params.sound, req.params.octave, req.params.volume),
        // dotfiles: 'deny',
        headers: {
          'Content-Type': 'audio/mp3',
          'Content-Encoding': 'gzip'
          // 'Content-Type': 'text/html',
          // 'x-sent': true
        }
      }
      // console.log('fuck you');
      // res.status(200);
      // fs.readdir(folderPath, (err, files) => {
      //   if(err) {
      //     console.error(err);
      //     res.status(500);
      //   }
      //   else {
      //     for(file of files) {
      //       // console.log(files)
      //       res.sendFile(file, options, (err) => {
      //         if(err) {
      //           console.error(err);
      //         } else {
      //           console.log('Sent:', file)
      //         }
      //       });
      //     }
      //   }
      // });
      
      // res.send('ahahahaha');

      console.log(folderPath + '/' + req.params.octave + '.zip')
      const output = fs.createWriteStream(folderPath + '/' + req.params.octave + '.zip');
      const archive = archiver('zip', {
        zlib: {level: 9}
      });

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });

      output.on('end', function() {
        console.log('Data has been drained');
      });

      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });

      archive.on('error', function(err) {
        throw err;
      });

      archive.pipe(output);

      const files = await fs.readdir(folderPath);

      console.log('hell')
      console.log(files);
      for(const file of files) {
        archive.file(file, {name: file})
      }
      archive.finalize();
      console.log('output', output);
      res.status(200);
      res.sendFile(output, options, () => {

      });
      res.send('output');
    } catch(err) {
      res.status(500);
      res.send(err);
    }
  })
  .post('/api/:sound/:octave/:volume', (req, res) => {
    try {
      res.status(200);
      res.send('pee');
    } catch(err) {
      res.status(500);
      res.send(err)
    }
  })

module.exports = router;
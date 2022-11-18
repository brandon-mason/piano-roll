const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const soundPath = path.join(path.resolve(__dirname, '..'), '/sounds');

router
  .get('/sounds/:sound/:octave/:volume/:note', async (req, res) => {
    try {
      var options = {
        root: path.join(soundPath, req.params.sound, req.params.octave, req.params.volume),
        dotfiles: 'deny',
        headers: {
          'Content-Type': 'audio/webm',
          'x-sent': true
        }
      }
      var fileName = req.params.note;
      // console.log(fileName);
      res.status(200);
      // res.send(fileName);
      res.sendFile(fileName, options, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Sent:', fileName)
        }
      })
    } catch(err) {
      res.status(500);
      res.send(err);
    }
})

module.exports = router;
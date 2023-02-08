const tracksRouter = require('express').Router();
const Users = require('../models/users');
const Track = require('../models/tracks');

tracksRouter
  .post('/save-track', async (req: any, res: any) => {
    try {
      const {username, trackname, midiNoteInfo} = req.body;
      // console.log(username)
      if(!username || !trackname || !midiNoteInfo) {
        return res.status(500).json({error: 'Invalid trackname and/or track.'})
      }
      var userId = '';
      Users.findOne({username: username}).lean().exec((err: Error, user: any) => {
        if(err) return err;

        const userI =  user._id;
        userId = userI.valueOf();

        Track.findOneAndDelete({userId: userId, trackname: trackname}, (err: Error) => {
          if(err) return err;
          // const trackId = track._id.valueOf()
          // Track.deleteOne({_id: Object(trackId)})
          console.log("Removed old version.");
        })

        const track = new Track({
          userId,
          trackname,
          midiNoteInfo,
        });
        track.save()
      });
      res.status(200)
      res.send(`Saved ${trackname}!`)
    } catch(err: any) {
      res.status(500);
      res.send(err.message)
    }
  })
  .get('/get-saved-tracks/:username', async (req: any, res:any) => {
    try {
      const username = req.params.username;

      if(!username) {
        res.status(500);
        res.send({error: "Please login or register."});
        return;
      }

      Users.findOne({username: username}).lean().exec((err: Error, user: any) => {
        if(err) return err;
        
        const userId = user._id.valueOf();
        
        var trackNames: string[] = []
        Track.find({userId: userId}, (err: Error, tracks: any) => {
          if(err) return err;

          tracks.forEach((track: any) => {
            trackNames.push(track.trackname);
          });
          // console.log(trackNames)
          res.status(200);
          res.send(JSON.stringify(trackNames.reverse()));
        })
      })
    } catch(err: any) {
      res.status(500);
      res.send(err.message);
    }
  })
  .get('/get-track/:username/:trackname', async (req: any, res: any) => {
    try {
      const {username, trackname} = req.params;

      if(!username || !trackname) return res.status(500).json({error: 'Field(s) missing.'})
  
      Users.findOne({username: username}).lean().exec((err: Error, user: any) => {
        if(err) return err;

        const userId = user._id.valueOf();
        Track.findOne({userId: userId, trackname: trackname}, (err: Error, track: any) => {
          if(err) return err;

          res.status(200);
          res.send(track.midiNoteInfo);
        })
      })

    } catch(err: any) {
      res.status(500)
      res.send(err.message)
    }
  })
  .delete('/delete-track', async (req: any, res: any) => {
    try {
      const {username, trackname} = req.body;
      console.log(req.body);
      if(!trackname) return res.status(500).json({error: 'Invalid Track Name'});

      Users.findOne({username: username}).lean().exec((err: Error, user: any) => {
        if(err) return err;

        const userId = user._id.valueOf();
        Track.deleteOne({userId: userId, trackname: trackname}, (err:Error, track: any) => {
          if(err) return err;

          res.status(200);
          res.send({message: `${trackname} successfully deleted`})
        })
      })
    } catch(err: any) {
      res.status(500)
      res.send(err.message)
    }
  })

module.exports = tracksRouter;
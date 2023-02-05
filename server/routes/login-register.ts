const logregRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const login = require('../middleware/login')
const jsonwebtoken = require('jsonwebtoken');

// interface User {
//   email: string,
//   username: string,
//   password: string
// }

logregRouter
  .post('/register', async (req: any, res: any) => {
    const {email, username, password} = req.body
    if(!email || !password || !username) {
      return res.status(500).json({error: 'Field(s) missing.'});
    }

    User.findOne({username: username}, (err: Error, user: any) => {
      if(err) return err;
      if(user) {
        res.status(422).json({error: 'Username taken. Please pick another username.'})
      } else {
        User.findOne({email: email}, (err: Error, savedUser: any) => {
          if(err) return err;
          if(savedUser) {
            return res.status(422).json({error: 'User already exists with that email.'});
          } else {
            bcrypt.hash(password, 12)
            .then((hashedpw: string) => {
              const user = new User({
                email,
                username,
                password: hashedpw,
              });
              user.save()
              .then((user: any) => {
              res.status(200).json(`${username} Registered!`);
              }).catch((err: Error) => console.error(err));
            })
          }
        })
      }
    })

    

    // const newUser = new User({email, username, password})
    // newUser.save()
    // .then(() => {
    //   res.status(200).json(`${username} Registered!`);
    //   console.log(`${username} Registered!`);

    // })
    // .catch((err: any) => {
    //   res.status(500).json(`Error: User ${username} not added`); 
    //   console.error(err);
    // });

    // console.log(req.body)

  })
  .post('/login', async (req: any, res: any) => {
    // console.log(req.session)
    const {username, password} = req.body;
    
    // const password = req.body.password;
    const user = new User({username, password})
    User.findOne({username: username})
    .then((savedUser: any) => {
      if(!savedUser) {
        return res.status(422).json({error: 'Invalid username or password.'});
      }
      bcrypt.compare(password, savedUser.password)
      .then((match: any) => {
        if(match) {
          const token = jsonwebtoken.sign({username}, process.env.SECRET);
          // res.setHeader('Access-Control-Allow-Credentials', true);
          // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
          // res.cookie('piano-roll', token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, overwrite: true});
          res.status(200);
          res.send({message: 'Login Successfull', data: token});
        } else {
          return res.status(422).json({error: 'Invalid username or password.'}); 
        }
      }).catch((err: Error) => console.error(err))

    })
    .catch((err: any) => {
      res.status(500).json(`Error: User ${username} not found.`); 
      console.error(err);
    });
  })
  .post('/logged-in', (req: any, res: any) => {
    // console.log(jsonwebtoken.verify(req.body.token, process.env.SECRET).username)
    if(!jsonwebtoken.verify(req.body.token, process.env.SECRET).username) return res.status(422).json({error: 'Invalid username'})
    User.findOne({username: jsonwebtoken.verify(req.body.token, process.env.SECRET).username})
    .then((savedUser: any) => {
      res.status(200)
      res.send({username: savedUser.username})
    }).catch((err: Error) => console.error(err))
  })
  .post('/logout', (req: any, res: any) => {
    // console.log(req.sessionID);
    // console.log('ie', req.cookies);
  })
 
  // .get('/protected', login, (req: any, res: any) => {
  //   console.log('hello');
  //   res.send('hello')
  // })

module.exports = logregRouter;
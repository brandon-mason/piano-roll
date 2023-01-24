const logregRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const login = require('../middleware/login')

// interface User {
//   email: string,
//   username: string,
//   password: string
// }

logregRouter
  .post('/register', async (req: any, res: any) => {
    const {email, username, password} = req.body
    console.log(req.body);
    var warnings = ''

    if(!email || !password || !username) {
      return res.status(500).json({error: 'Field(s) missing.'});
    }

    if(!email.includes('@') || !email.includes('.com') || email.length < 7) {
      warnings = 'Invalid Email';
    }
    if(username.length < 5) {
      warnings = warnings + '\nInvalid Username';
    }
    if(password.length < 7) {
      warnings = warnings + '\nInvalid Password';
    }
    console.log(warnings)
    if(warnings.length > 0) {
      res.status(400);
      return res.send({error: warnings})
    }

    const userExists = await User.exists({username: username});
    if(userExists) 
      return res.status(422).json({error: 'Username taken. Please pick another one.'})
    else {
      User.findOne({email: email}, (err: Error, savedUser: any) => {
        if(err) return err;
        if(savedUser) {
          return res.status(422).json({error: 'User already exists with that email. Please log in.'});
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
  .post('/login', async (req: any, res: any) => {
    console.log(req.body)
    const {username, password} = req.body;
    if(!username || !password) return res.status(500).json({error: 'Invalid username and/or password.'})
    // const password = req.body.password;
    const user = new User({username, password})
    const userExists = await User.exists({username: username});

    if(userExists) {
      User.findOne({_id: userExists._id.valueOf()}, (err: Error, savedUser: any) => {
        if(err) return err;

        bcrypt.compare(password, savedUser.password)
        .then((match: any) => {
          if(match) {
            res.json({message: 'Login Successfull'});
          } else {
            return res.status(422).json({error: 'Invalid username and/or password.'}); 
          }
        })
      })
    } else {
      res.status(422)
      return res.send({error: 'Invalid username and/or password.'});
    }
  })
  .get('/protected', login, (req: any, res: any) => {
    res.send('hello')
  })

module.exports = logregRouter;
const logregRouter = require('express').Router();
const bcrypt = require('bcrypt');
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

    if(!email || !password || !username) {
      return res.status(500).json({error: 'Field(s) missing.'});
    }

    bcrypt.hash(password, 12)
    .then((hashedpw: string) => {
      User.findOne({email: email})
      .then((savedUser: any) => {
        if(savedUser) {
          return res.status(422).json({error: 'User already exists with that email.'});
        }
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
    }).catch((err: Error) => console.error(err));

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

    console.log(req.body)

  })
  .post('/login', async (req: any, res: any) => {
    console.log(req.body)
    const {username, password} = req.body;
    // const password = req.body.password;
    const user = new User({username, password})
    User.findOne({username: username})
    .then((savedUser: any) => {
      if(!savedUser) {
        return res.status(422).json({error: 'Invalid username of password.'});
      }
      bcrypt.compare(password, savedUser.password)
      .then((match: any) => {
        if(match) {
          res.json({message: 'Login Successfull'});
        } else {
          return res.status(422).json({error: 'Invalid username of password.'}); 
        }
      }).catch((err: Error) => console.error(err))
      // res.status(200).json(savedUser);
      // console.log(`${username} Logged in!`);

    })
    .catch((err: any) => {
      res.status(500).json(`Error: User ${username} not found.`); 
      console.error(err);
    });
  })
  .get('/protected', login, (req: any, res: any) => {
    res.send('hello')
  })

module.exports = logregRouter;
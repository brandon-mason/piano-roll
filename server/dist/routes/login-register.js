"use strict";
const logregRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const login = require('../middleware/login');
// interface User {
//   email: string,
//   username: string,
//   password: string
// }
logregRouter
    .post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !password || !username) {
        return res.status(500).json({ error: 'Field(s) missing.' });
    }
    User.findOne({ username: username }, (err, user) => {
        if (err)
            return err;
        if (user) {
            res.status(422).json({ error: 'Username taken. Please pick another username.' });
        }
        else {
            User.findOne({ email: email }, (err, savedUser) => {
                if (err)
                    return err;
                if (savedUser) {
                    return res.status(422).json({ error: 'User already exists with that email.' });
                }
                else {
                    bcrypt.hash(password, 12)
                        .then((hashedpw) => {
                        const user = new User({
                            email,
                            username,
                            password: hashedpw,
                        });
                        user.save()
                            .then((user) => {
                            res.status(200).json(`${username} Registered!`);
                        }).catch((err) => console.error(err));
                    });
                }
            });
        }
    });
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
    .post('/login', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    // const password = req.body.password;
    const user = new User({ username, password });
    User.findOne({ username: username })
        .then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: 'Invalid username of password.' });
        }
        bcrypt.compare(password, savedUser.password)
            .then((match) => {
            if (match) {
                res.json({ message: 'Login Successfull' });
            }
            else {
                return res.status(422).json({ error: 'Invalid username of password.' });
            }
        }).catch((err) => console.error(err));
        // res.status(200).json(savedUser);
        // console.log(`${username} Logged in!`);
    })
        .catch((err) => {
        res.status(500).json(`Error: User ${username} not found.`);
        console.error(err);
    });
})
    .get('/protected', login, (req, res) => {
    res.send('hello');
});
module.exports = logregRouter;

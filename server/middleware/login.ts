const jwt = require('jsonwebtoken');
const JWT_SECRET = 42501;
const mongoose_mod = require('mongoose');
const User_mod = require('../models/users')

module.exports = (req: any, res: any, next: Function) => {
  console.log(req.headers)
  const {authorization} = req.headers;
  if(!authorization) {
    return res.status(401).json({error: 'Please login.'});
  }
  
  const token = authorization.replace('bearer ', '');
  console.log(token);
  jwt.verify(token, JWT_SECRET, (err: Error, payload: any) => {
    if(err) {
      return res.status(401).json({error: 'Please login.'});
    }
    const {_id} = payload;
    User_mod.findById(_id).then((userdata: any) => {
      req.user = userdata;
      next();
    })
  })
}
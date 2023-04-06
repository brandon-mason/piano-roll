const express = require('express');
const app = express();
const cors = require('cors');
// const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose')
// const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config({path:__dirname+'/../.env'});
const PORT = process.env.SERVER_PORT || 3001;

// app.set('trust proxy', 1);

app.use(cors({ credentials: true, origin: true }))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cookie_parser(process.env.SECRET));

// const uri = `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@localhost:27017/?maxPoolSize=20`;
// const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-piano:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin&&retryWrites=true&w=majority`;
const uri = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.set('strictQuery', true);
mongoose.connect(uri, {useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Successfully connected to MongoDB!');
});

// var store = new MongoDBStore({uri, collection: 'sessions'});

// store.on('error', (err: Error) => {
//   console.error(err)
// });

// app.use(session({
//   secret: process.env.SECRET, 
//   resave: false, 
//   saveUninitialized: false, 
//   store: store, 
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000, 
//     httpOnly: false,
//     secure: false
//   }
// }));

// app.use(function (req: any, res: any, next: any) {
//   // req.session.test = "test";
//   next();
// });

app.get('/', async (req: any, res: any) => {
  // console.log(req.session, 'hhhh')
  res.send('<h1>Hello Express!</h1>')
})
app.use('/api', require('./routes/login-register'))
app.use('/api', require('./routes/tracks'))

app.use('/api', require('./routes/sound-file-count'));
app.use('/sounds', express.static(path.join(__dirname, '/sounds')));

//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});


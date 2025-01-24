import * as express from 'express';
import * as cors from 'cors';
// import session from 'express-session';
import * as path from 'path';
import * as mongoose from 'mongoose';
// import MongoDBStore from 'connect-mongodb-session';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// app.set('trust proxy', 1);

app.use(cors({ credentials: true, origin: true }))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cookie_parser(process.env.SECRET));

// const uri = `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@localhost:27017/?maxPoolSize=20`;
// const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-piano:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin&&retryWrites=true&w=majority`;
const uri: string = process.env.MONGO_DB_CONNECTION_STRING || '';
let dbLoaded = false;

mongoose.set('strictQuery', true);
mongoose.connect(uri, {useNewUrlParser: true}, (err: any) => {
  if(err) {
    console.log('Failed to connect to MongoDB.');
    dbLoaded = false;
  } else {
    console.log('Successfully connected to MongoDB!');
    dbLoaded = true;
  }
});

const connection = mongoose.connection;
connection.once('open', () => {
  app.use('/api', require('./routes/login-register'))
});

// app.get('/', async (req: any, res: any) => {
  //   res.send('<h1>Hello Express!</h1>');
  // });
  
  app.get('/api/db-loaded', (req: any, res: any) => {
    res.send({dbLoaded: dbLoaded});
  });
  
  app.use('/api', require('./routes/tracks'))
  
  app.use('/api', require('./routes/sound-file-count'));
  app.use('/sounds', express.static(path.join(__dirname, '/sounds')));
  
//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});

// module.exports = app;
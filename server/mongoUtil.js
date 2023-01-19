const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config({path:__dirname+'/../.env'});
const uri = `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@${process.env.ME_CONFIG_MONGODB_SERVER}:27017/?maxPoolSize=20&w=majority?compressors=snappy,zlib`;
// const client = new MongoClient(uri);
var database;

mongoose.createConnection(uri);

modules.export = mongoose;

// module.exports = {
//   connectToServer: function(callback) {
//     console.log(uri);
//     MongoClient.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }, (err, db) => {
//       console.log('bee');
//       if(err) {
//         console.error(err)
//         throw err
//       } else {
//         console.log('Successfully connected to MongoDB!');
//       }
//       database = db.db('midiDB')

//       // database = db.db('midiDB')
//       database.close()
//       done();
//     });
//   },

//   getDb: function() {
//     return database;
//   }
// }
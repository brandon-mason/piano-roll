const SchemaU = require('mongoose').Schema;

const UserInfoSchema = new SchemaU({
  email: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {timestamps: true});

module.exports = require('mongoose').model('UserInfo', UserInfoSchema);
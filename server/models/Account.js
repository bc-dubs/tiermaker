/*
    Mongoose model for user account
    Code in this file mostly from Cody Van De Mark / Austin Willoughby
*/

const bcrypt = require('bcrypt'); // For password encryption
const mongoose = require('mongoose');

// How many rounds of encryption we want
const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converting account to something we can store in Redis
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Secure method to authenticate password
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    // Finding reference for username
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    // Checking password against stored password for that username
    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;

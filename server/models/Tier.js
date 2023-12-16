const mongoose = require('mongoose');

let TierModel = {};

const TierSchema = new mongoose.Schema({
  grade: { // The letter grade associated with this tier
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
  },
  index: { // The numerical value of this tier (0 is the top)
    type: Number,
    default: 0,
  },
  color: { // The color of this tier, as a hex code string
    type: String,
    lowercase: true,
    match: /^[a-f0-9]/,
  },
  numEntries: {
    type: Number,
    min: 0,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TierSchema.statics.toAPI = (doc) => ({
  grade: doc.grade,
  index: doc.index,
});

TierModel = mongoose.model('Tier', TierSchema);
module.exports = TierModel;

const mongoose = require('mongoose');

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
        default: 0
    },
    text: { // Additional label for this tier
        type: String,
        trim: true,
    },
    color: { // The color of this tier, as a hex code string
        type: String,
        lowercase: true,
        match: /^[a-f0-9]/,
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

TierSchema.static.toAPI = (doc) => ({
    grade: doc.grade,
    index: doc.index,
});

const TierModel = mongoose.model('Tier', TierSchema);
module.exports = TierModel;
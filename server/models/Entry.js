const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const EntrySchema = new mongoose.Schema({
    name:{ // Name of the entry
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    index: { // Index of this entry within its tier
        type: Number,
        default: 0
    },
    tier:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tier',
    },
    color: { // The color of this entry, as a hex code string
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

EntrySchema.static.toAPI = (doc) => ({
    name: doc.name,
    index: doc.index,
    tier: doc.tier
});

const EntryModel = mongoose.model('Entry', EntrySchema);
module.exports = EntryModel;
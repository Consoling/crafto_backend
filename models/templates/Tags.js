const mongoose = require('mongoose');


const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    match: /^[a-z0-9-_]+$/, 
  },
  emoji: {
    type: String,
    required: false, 
  },
}, {
  timestamps: true, 
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;

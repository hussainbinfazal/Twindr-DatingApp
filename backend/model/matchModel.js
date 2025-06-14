const mongoose = require('mongoose'); 

const matchSchema = new mongoose.Schema({
  curentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model
    required: true,
  },
  likedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending',
  },
  // You can add more fields as needed, e.g., to track messages or interactions
},{timestamps: true});

const Match = mongoose.model('Match', matchSchema);

module.exxports = Match;

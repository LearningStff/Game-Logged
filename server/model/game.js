import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  gameId: {
    type: Number,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  released: {
    type: String
  },

  status: {
    type: String,
    required: true
  },

  rating: {
    type: Number
  },

  review: {
    type: String,
    default: ''
  }
})

const Game = mongoose.model('Game', gameSchema)

export default Game
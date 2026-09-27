import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Game from './model/game.js'

dotenv.config()
console.log("Mongo URI exists:", !!process.env.MONGO_URI)

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error)
  })

app.get('/api/test', (req, res) => {
  res.json({
    message: 'GameLog backend is working'
  })
})

app.post('/api/games', async (req, res) => {
  try {
    console.log(req.body)

    const game = await Game.findOneAndUpdate(
      { gameId: req.body.gameId },
      req.body,
      {
        returnDocument: 'after',
        upsert: true
      }
    )

    res.json({
      message: 'Game saved',
      game: game
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to save game'
    })
  }
})
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find()

    res.json(games)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to get games'
    })
  }
})

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Game removed',
      game: game
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to remove game'
    })
  }
})

app.get('/api/games/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({
      gameId: Number(req.params.gameId)
    })

    if (!game) {
      return res.status(404).json({
        message: 'Game not found'
      })
    }

    res.json(game)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to get game'
    })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
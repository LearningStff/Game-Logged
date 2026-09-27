import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Game from './model/game.js'
import User from './model/user.js'
import bcrypt from 'bcrypt'
import session from 'express-session'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express()

// Local development uses localhost.
// When deployed, CLIENT_URL will be your deployed frontend URL.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Render will use production mode.
// Locally this will be false.
const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  app.set('trust proxy', 1)
}

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    }
  })
)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error)
  })


// TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({
    message: 'GameLog backend is working'
  })
})


// SAVE OR UPDATE GAME
app.post('/api/games', async (req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        message: 'You must be logged in'
      })
    }

    const game = await Game.findOneAndUpdate(
      {
        user: userId,
        gameId: req.body.gameId
      },
      {
        user: userId,
        gameId: req.body.gameId,
        title: req.body.title,
        image: req.body.image,
        released: req.body.released,
        status: req.body.status,
        rating: req.body.rating,
        review: req.body.review
      },
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


// GET ALL GAMES FOR LOGGED-IN USER
app.get('/api/games', async (req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        message: 'You must be logged in'
      })
    }

    const games = await Game.find({
      user: userId
    })

    res.json(games)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to get games'
    })
  }
})


// DELETE GAME
app.delete('/api/games/:id', async (req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        message: 'You must be logged in'
      })
    }

    const game = await Game.findOneAndDelete({
      _id: req.params.id,
      user: userId
    })

    if (!game) {
      return res.status(404).json({
        message: 'Game not found'
      })
    }

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


// GET ONE SAVED GAME
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        message: 'You must be logged in'
      })
    }

    const game = await Game.findOne({
      user: userId,
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


// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const existingUser = await User.findOne({
      email: email
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Account created',

      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to create account'
    })
  }
})


// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
      email: email
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatches) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    req.session.userId = user._id

    res.json({
      message: 'Login successful',

      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to login'
    })
  }
})


// GET LOGGED-IN USER
app.get('/api/me', async (req, res) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        message: 'Not logged in'
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to get user'
    })
  }
})


// LOGOUT
app.post('/api/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: 'Failed to logout'
      })
    }

    res.json({
      message: 'Logged out'
    })
  })
})


// START SERVER
const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
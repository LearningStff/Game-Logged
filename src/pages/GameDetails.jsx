import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function GameDetails() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [status, setStatus] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchGame() {
      const response = await fetch(
        `https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_RAWG_API_KEY}`
      )

      const data = await response.json()
      setGame(data)
    }

    async function fetchSavedGame() {
      const response = await fetch(
        `http://localhost:3000/api/games/${id}`
      )

      if (response.ok) {
        const savedGame = await response.json()

        setStatus(savedGame.status)
        setRating(savedGame.rating)
        setReview(savedGame.review)
      }
    }

    fetchGame()
    fetchSavedGame()
  }, [id])

  async function saveGame() {
    if (!status) {
      setSaveMessage('Please select a status')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/games', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          gameId: game.id,
          title: game.name,
          image: game.background_image,
          released: game.released,
          status: status,
          rating: rating,
          review: review
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save game')
      }

      await response.json()

      setSaveMessage('✓ Saved to My Games')
    } catch (error) {
      console.log(error)
      setSaveMessage('Failed to save game')
    } finally {
      setIsSaving(false)
    }
  }

  if (!game) {
    return (
      <main className="p-8">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main>

      {/* Hero */}
      <section className="relative h-[500px] overflow-hidden">

        <img
          src={game.background_image}
          alt={game.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-black/20"></div>

        {/* Game information */}
        <div className="absolute bottom-0 left-0 w-full px-10 pb-10">
          <div className="max-w-5xl">

            <p className="mb-2 text-gray-300">
              {game.released?.slice(0, 4)}
            </p>

            <h1 className="text-6xl font-bold">
              {game.name}
            </h1>

            <div className="mt-4 flex gap-3">
              {game.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-4 text-lg text-gray-300">
              ★ {game.rating} / 5
            </p>

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-8 py-10">

        {/* Your Game */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">

          <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Your Game
          </p>

          <div className="flex flex-wrap items-end gap-8">

            {/* Status */}
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Status
              </p>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white outline-none"
              >
                <option value="">Select status</option>
                <option value="Want to Play">Want to Play</option>
                <option value="Playing">Playing</option>
                <option value="Completed">✓ Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Your Rating
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating
                        ? 'text-yellow-400'
                        : 'text-gray-600 hover:text-yellow-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              onClick={saveGame}
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save to My Games'}
            </button>

          </div>

          {/* Review */}
          <div className="mt-6">
            <p className="mb-2 text-sm text-gray-400">
              Your Review
            </p>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your thoughts about this game..."
              rows="5"
              className="w-full resize-none rounded-lg bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Feedback */}
          {saveMessage && (
            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                saveMessage.startsWith('✓')
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}
            >
              {saveMessage}
            </div>
          )}

        </div>

        {/* About */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold">
            About
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-gray-400">
            {game.description_raw}
          </p>
        </div>

      </section>
    </main>
  )
}

export default GameDetails
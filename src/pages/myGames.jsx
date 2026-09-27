import { useEffect, useState } from 'react'
import GameCard from '../components/gamecard'

function MyGames() {
  const [games, setGames] = useState([])
  const [filter, setFilter] = useState('All')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    async function fetchMyGames() {
    const response = await fetch('http://localhost:3000/api/games', {
      credentials: 'include'
    })
      const data = await response.json()

      setGames(data)
    }

    fetchMyGames()
  }, [])

  async function removeGame(id) {
    const response = await fetch(`http://localhost:3000/api/games/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    const data = await response.json()
    console.log(data)

    if (response.ok) {
      setGames(games.filter((game) => game._id !== id))
      setRemovingId(null)
    }
  }

  const filteredGames =
    filter === 'All'
      ? games
      : games.filter((game) => game.status === filter)

  const filters = [
    'All',
    'Playing',
    'Completed',
    'Want to Play',
    'Dropped'
  ]

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Library
        </p>

        <h1 className="text-5xl font-bold">
          My Games
        </h1>

        <p className="mt-3 text-gray-400">
          Games you've saved to your library.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {filters.map((filterName) => (
          <button
            key={filterName}
            onClick={() => setFilter(filterName)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              filter === filterName
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {filterName}
          </button>
        ))}
      </div>

      {games.length === 0 ? (
        <p className="text-gray-400">
          You haven't added any games yet.
        </p>
      ) : filteredGames.length === 0 ? (
        <p className="text-gray-400">
          No games found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

          {filteredGames.map((game) => (
            <div key={game._id}>

              <GameCard
                id={game.gameId}
                title={game.title}
                image={game.image}
                rating={game.rating}
                year={game.released}
              />

              <p className="mt-2 text-sm text-blue-400">
                {game.status}
              </p>

              {/* Review */}
              {game.review && (
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  "{game.review}"
                </p>
              )}

              {removingId === game._id ? (
                <div className="mt-2 flex items-center gap-3">

                  <button
                    onClick={() => setRemovingId(null)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => removeGame(game._id)}
                    className="text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    Confirm Remove
                  </button>

                </div>
              ) : (
                <button
                  onClick={() => setRemovingId(game._id)}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  )
}

export default MyGames
import { useEffect, useState } from 'react'
import GameCard from '../components/gamecard'

function MyGames() {
  const [games, setGames] = useState([])

  useEffect(() => {
    async function fetchMyGames() {
      const response = await fetch('http://localhost:3000/api/games')
      const data = await response.json()

      setGames(data)
    }

    fetchMyGames()
  }, [])

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

      {games.length === 0 ? (
        <p className="text-gray-400">
          You haven't added any games yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

          {games.map((game) => (
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
            </div>
          ))}

        </div>
      )}

    </main>
  )
}

export default MyGames
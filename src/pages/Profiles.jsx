import { useEffect, useState } from 'react'
import GameCard from '../components/gamecard'

function Profile() {
  const [games, setGames] = useState([])

  useEffect(() => {
    async function fetchGames() {
      const response = await fetch('http://localhost:3000/api/games')
      const data = await response.json()

      setGames(data)
    }

    fetchGames()
  }, [])

  const completedGames = games.filter(
    (game) => game.status === 'Completed'
  ).length

  const playingGames = games.filter(
    (game) => game.status === 'Playing'
  ).length

  const ratedGames = games.filter(
    (game) => game.rating > 0
  )

  const averageRating =
    ratedGames.length > 0
      ? (
          ratedGames.reduce(
            (total, game) => total + game.rating,
            0
          ) / ratedGames.length
        ).toFixed(1)
      : '—'

  const recentGames = games.slice(-5).reverse()

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Profile Header */}
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Profile
        </p>

        <h1 className="text-5xl font-bold">
          Nathan
        </h1>

        <p className="mt-3 text-gray-400">
          Your gaming activity.
        </p>
      </section>

      {/* Stats */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-3xl font-bold">
            {games.length}
          </p>

          <p className="mt-1 text-gray-400">
            Games
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-3xl font-bold">
            {completedGames}
          </p>

          <p className="mt-1 text-gray-400">
            Completed
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-3xl font-bold">
            {playingGames}
          </p>

          <p className="mt-1 text-gray-400">
            Playing
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-3xl font-bold">
            {averageRating}
          </p>

          <p className="mt-1 text-gray-400">
            Avg Rating
          </p>
        </div>

      </section>

      {/* Recently Added */}
      <section className="mt-14">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Recently Added
          </h2>

          <p className="mt-1 text-gray-400">
            Your latest games.
          </p>
        </div>

        {recentGames.length === 0 ? (
          <p className="text-gray-400">
            You haven't added any games yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

            {recentGames.map((game) => (
              <GameCard
                key={game._id}
                id={game.gameId}
                title={game.title}
                year={game.released}
                image={game.image}
                rating={game.rating}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  )
}

export default Profile
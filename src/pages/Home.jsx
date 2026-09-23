import { useEffect, useState } from 'react'
import GameCard from "../components/gamecard";

function App() {
  const [games, setGames] = useState([])
  const [search, setSearch] = useState('')

  async function fetchGames(searchQuery = '') {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${searchQuery}`
    )

    const data = await response.json()
    setGames(data.results)
  }

  useEffect(() => {
    fetchGames()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    fetchGames(search)
  }

  return (
  <main className="mx-auto max-w-7xl px-6 py-12">

    {/* Header */}
    <section className="mb-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
        Discover
      </p>

      <h1 className="text-5xl font-bold tracking-tight">
        Find your next game.
      </h1>

      <p className="mt-3 max-w-xl text-lg text-gray-400">
        Search games, track what you're playing, and keep a record of what you've completed.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-7 flex max-w-2xl overflow-hidden rounded-xl border border-gray-700 bg-gray-900"
      >
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent px-5 py-4 text-white outline-none placeholder:text-gray-500"
        />

        <button
          type="submit"
          className="m-1 rounded-lg bg-blue-600 px-6 font-semibold transition hover:bg-blue-500"
        >
          Search
        </button>
      </form>
    </section>

    {/* Games */}
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Popular Games
        </h2>

        <span className="text-sm text-gray-500">
          {games.length} games
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.name}
            year={game.released}
            image={game.background_image}
            rating={game.rating}
          />
        ))}
      </div>
    </section>

  </main>
)
}

export default App
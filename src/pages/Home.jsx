import { useEffect, useState } from 'react'
import GameCard from "../components/gamecard";

function App() {
  const [games, setGames] = useState([])
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [category, setCategory] = useState('popular')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'new', label: 'New Releases' },
    { id: 'upcoming', label: 'Upcoming' }
  ]

  function getDate(daysFromToday = 0) {
    const date = new Date()
    date.setDate(date.getDate() + daysFromToday)

    return date.toISOString().split('T')[0]
  }

  async function fetchGames(searchQuery = '', pageNumber = 1, loadMore = false) {
    if (loadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    let url =
      `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&page=${pageNumber}`

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`
    } else {
      if (category === 'popular') {
        url += '&ordering=-added'
      }

      if (category === 'top-rated') {
        url += '&ordering=-rating'
      }

      if (category === 'new') {
        const ninetyDaysAgo = getDate(-90)
        const today = getDate()

        url += `&dates=${ninetyDaysAgo},${today}&ordering=-released`
      }

      if (category === 'upcoming') {
        const today = getDate()
        const oneYearFromNow = getDate(365)

        url += `&dates=${today},${oneYearFromNow}&ordering=released`
      }
    }

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (loadMore) {
        setGames((currentGames) => [
          ...currentGames,
          ...(data.results || [])
        ])
      } else {
        setGames(data.results || [])
      }

      setHasMore(Boolean(data.next))
    } catch (error) {
      console.log(error)

      if (!loadMore) {
        setGames([])
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setActiveSearch('')
    fetchGames('', 1)
  }, [category])

  function handleSearch(e) {
    e.preventDefault()

    const searchQuery = search.trim()

    setPage(1)
    setActiveSearch(searchQuery)

    fetchGames(searchQuery, 1)
  }

  function selectCategory(categoryId) {
    setCategory(categoryId)
    setSearch('')
    setActiveSearch('')
  }

  function clearSearch() {
    setSearch('')
    setActiveSearch('')
    setPage(1)

    fetchGames('', 1)
  }

  function loadMoreGames() {
    const nextPage = page + 1

    setPage(nextPage)
    fetchGames(activeSearch, nextPage, true)
  }

  const currentCategory =
    categories.find((item) => item.id === category)

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

      {/* Categories */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => selectCategory(item.id)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              category === item.id && !activeSearch
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Games */}
      <section>
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {activeSearch
                ? `Search results for "${activeSearch}"`
                : currentCategory?.label}
            </h2>

            {activeSearch && (
              <button
                onClick={clearSearch}
                className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Clear Search
              </button>
            )}
          </div>

          <span className="text-sm text-gray-500">
            {games.length} games
          </span>

        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="aspect-[3/4] rounded-xl bg-gray-800"></div>

                <div className="mt-3 h-5 w-3/4 rounded bg-gray-800"></div>

                <div className="mt-2 h-4 w-1/3 rounded bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            No games found.
          </div>
        ) : (
          <>
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

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMoreGames}
                  disabled={loadingMore}
                  className="rounded-xl border border-gray-700 bg-gray-900 px-8 py-3 font-semibold text-gray-200 transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

    </main>
  )
}

export default App
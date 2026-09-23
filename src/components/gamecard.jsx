import { Link } from 'react-router-dom'

function GameCard({ id, title, year, image, rating }) {
  return (
    <Link
      to={`/game/${id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl bg-gray-800">
        <img
          src={image}
          alt={title}
          className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3">
        <h3 className="truncate font-semibold text-white transition group-hover:text-blue-400">
          {title}
        </h3>

        <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
          <span>
            {year ? year.slice(0, 4) : 'TBA'}
          </span>

          <span className="text-gray-400">
            ★ {rating}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
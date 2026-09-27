import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-800 px-8 py-4">

      <Link to="/" className="text-2xl font-bold">
        GameLog
      </Link>

      <div className="flex gap-6 text-gray-300">

        <Link to="/" className="hover:text-white">
          Discover
        </Link>

        <Link to="/my-games" className="hover:text-white">
          My Games
        </Link>

        <Link to="/profile" className="hover:text-white">
          Profile
        </Link>

      </div>

    </nav>
  )
}

export default Navbar
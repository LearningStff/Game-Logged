import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  async function logoutUser() {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      setUser(null)
      navigate('/login')
    }
  }

  function showAccountLinks() {
    if (user) {
      return (
        <>
          <Link to="/profile" className="hover:text-white">
            {user.username}
          </Link>

          <button
            onClick={logoutUser}
            className="hover:text-white"
          >
            Logout
          </button>
        </>
      )
    }

    return (
      <>
        <Link to="/login" className="hover:text-white">
          Login
        </Link>

        <Link to="/register" className="hover:text-white">
          Register
        </Link>
      </>
    )
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-800 px-8 py-4">

      <Link to="/" className="text-2xl font-bold">
        GameLog
      </Link>

      <div className="flex items-center gap-6 text-gray-300">

        <Link to="/" className="hover:text-white">
          Discover
        </Link>

        <Link to="/my-games" className="hover:text-white">
          My Games
        </Link>

        {showAccountLinks()}

      </div>

    </nav>
  )
}

export default Navbar
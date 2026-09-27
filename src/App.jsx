import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MyGames from './pages/myGames'
import Navbar from './components/navbar'
import Home from './pages/Home'
import GameDetails from './pages/GameDetails'
import Profiles from './pages/Profiles'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/me`,
        {
          credentials: 'include'
        }
      )

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }

      setLoading(false)
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8 text-white">
        Loading...
      </div>
    )
  }

  function showMyGames() {
    if (user) {
      return <MyGames />
    }

    return <Navigate to="/login" />
  }

  function showProfile() {
    if (user) {
      return <Profiles />
    }

    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetails />} />

        <Route
          path="/my-games"
          element={showMyGames()}
        />

        <Route
          path="/profile"
          element={showProfile()}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />
      </Routes>

    </div>
  )
}

export default App
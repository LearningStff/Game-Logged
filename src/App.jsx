import { Routes, Route } from 'react-router-dom'
import MyGames from './pages/myGames'
import Navbar from './components/navbar'
import Home from './pages/Home'
import GameDetails from './pages/GameDetails'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/my-games" element={<MyGames />} />
      </Routes>
    </div>
  )
}

export default App
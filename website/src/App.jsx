import GameCard from './components/GameCard'
import NavBar from "./components/NavBar"
import Favorites from './pages/Favorites'
import { GameProvider } from './contexts/GameContext.jsx'
import GamePage from './pages/GamePage'
import Home from './pages/Home'
import {Routes, Route} from "react-router-dom"
import './css/App.css'

function App() {
  return (
    <GameProvider>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/games/:id" element={<GamePage  />} />
          <Route path="/favorites" element={<Favorites />}></Route>
        </Routes>
    </GameProvider>
  )
}

export default App

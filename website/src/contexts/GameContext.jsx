import {createContext, useState, useContext, useEffect} from "react"

const GameContext = createContext()

export const useGameContext =() => useContext(GameContext)

export const GameProvider = ({children}) => {

    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (game) => {
        setFavorites(prev => [...prev, game])
    }

    const removeFromFavorites = (gameID) => {
        setFavorites(prev => prev.filter(game => game.id !== gameID))
    }

    const isFavorite = (gameID) => {
        return favorites.some(game => game.id === gameID)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <GameContext.Provider value={value}>
        {children}
    </GameContext.Provider>
}
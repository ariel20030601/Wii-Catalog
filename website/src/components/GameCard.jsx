import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useGameContext } from "../contexts/GameContext";
import "../css/GameCard.css"

function GameCard({game}) {

    const {isFavorite, addToFavorites, removeFromFavorites} = useGameContext();
    const favorite = isFavorite(game.id)

    const [imgError, setImgError] = useState(false);

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(game.id)
        else addToFavorites(game)    
    }

    if (imgError) return null;

    return (
        <Link to={`/games/${game.id}`} className="game-card">
            <div className="game-poster">
                <img
                    src={game.cover}
                    alt={game.title}
                    onError={() => setImgError(true)}
                    loading="lazy"
                />
                <div className="game-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                        ★
                    </button>
                </div>
            </div>
            <div className="game-info">
                <h3>{game.title}</h3>
                <p></p>
                <p>Release Date: {game.date}</p>
                <p>Genre: {game.genres.join(', ')}</p>
            </div>
        </Link>
    )
}

export default GameCard
import { useParams } from "react-router-dom";
import { getGames, findGameByID, getFullCoverUrl, findSimilarGames, formatSynopsis} from "../services/api";
import {useEffect, useCallback} from "react"
import React, { useState } from "react";
import  GameCard  from "../components/GameCard"
import "../css/GameCard.css"
import "../css/Home.css"
import "../css/GamePage.css"

function GamePage() {

    const { id } = useParams();
    const [foundgame, setGame] = useState([]);
    const [loading, setLoading] = useState(true);
    const [similarGames, setSimilarGames] = useState([]);

    useEffect(() => {
        const loadGame = async() => {
            try {
                const loadgame = await findGameByID(id);
                setGame(loadgame);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        loadGame();
    }, [id])

    useEffect(() => {
        if (!foundgame?.title) return;

        const searchGame = async() => {
            try {
                const searchgames = await findSimilarGames(foundgame);
                setSimilarGames(searchgames)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        searchGame();
    }, [foundgame])


    return (
        <>
        <div className="game-page">
            <div className="game-page-title"> <h1> {foundgame.title} </h1> </div>
            <div className="game-page-container">
                <div className="game-page-info">
                    <div
                        className="game-synopsis"
                        dangerouslySetInnerHTML={{ __html: formatSynopsis(foundgame.synopsis) }}
                    />
                    <p> Release  Date: {foundgame.date}</p>
                </div>
                <div className="game-page-images">
                    <img
                        src={foundgame.cover}
                        alt={foundgame.title}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                    <img
                        src={getFullCoverUrl(foundgame.id, "EN")}
                        alt={foundgame.title}
                        data-lang="EN"
                        onError={(e) => {
                            const fallbackLangs = ["US", "JA", "FR"];
                            const currentLang = e.target.dataset.lang;
                            const nextLang = fallbackLangs.shift();

                            if (nextLang) {
                            e.target.src = getFullCoverUrl(foundgame.id, nextLang);
                            e.target.dataset.lang = nextLang;
                            } else {
                            e.target.src = "/fallback-cover.png";
                            }
                        }}
                    />

                </div>
            </div>
            <div className="similar-games">
                <h2>Similar Games</h2>
                <div className="similar-games-list">
                    {similarGames.length > 0 ? (
                        similarGames.map(game => (
                            <GameCard game={game} key={game.id} />
                        ))
                        ) : (
                        <p>No similar games found.</p>
                    )}
                </div>
            </div>
        </div>
         </>
    )
}

export default GamePage;
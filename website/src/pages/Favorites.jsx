import "../css/Favorites.css"
import { useGameContext } from "../contexts/GameContext"
import GameCard from "../components/GameCard"

function Favorites() {
    const {favorites} = useGameContext();

    if(favorites) {
        return (
        <div className="home">
            <div className="introduction">
                <h2> Favorite Games </h2>
                <p> A collection of your current favorited games! </p>
            </div>
            <div className="games-grid">
                {favorites.map(
                    (game) => 
                        (
                         <GameCard game={game} key={game.id} />
                        )
                )}
            </div>
        </div>
        );
        } else {

        return(
            <div className="home">
                <div className="introduction">
                    <h2> Favorite Games </h2>
                    <p> A collection of your current favorited games! </p>
                </div>
                <div className="favorites-empty">
                    <h2>No Favorite Games Yet</h2>
                    <p>Start adding games to your favorites and they will appear here</p>
                </div>
            </div>
        )
    }
}

export default Favorites
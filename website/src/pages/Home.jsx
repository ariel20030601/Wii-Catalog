import GameCard from '../components/GameCard';
import { Link } from 'react-router-dom';
import { getGames, searchGames } from '../services/api';
import "../css/Home.css"
import {useState, useEffect, useCallback} from "react"

function debounce(func, delay) {
  let timer;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [allgames, setGames] = useState([]);
    const [originalGames, setOriginalGames] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGames = async () => {
            try {
                const loadedgames = await getGames();
                setGames(loadedgames);
                setOriginalGames(loadedgames);
            } catch (err) {
                console.log(err)
                setError("Failed to load games...");
            }
            finally{
                setLoading(false);
            }
        }
        loadGames();
    }, [])

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setGames(originalGames);
            return;
        }

        console.log("Whats going on man");
        setLoading(true) 
        try {
            console.log("Starting search for:", searchQuery);
            const searchResults = await searchGames(originalGames, query)
            console.log("Search results:", searchResults);
            setGames(searchResults);
            setError(null);
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to search for games...");
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 500), [originalGames]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchQuery);
    }

    return (
        <>
        <div className="home">
        <div className="introduction">
            <div className="catalog-flower-header">
                <div className="flower-card flower-left">
                    <img src="/images/image1.png" />
                </div>
                <div className="flower-card flower-top">
                    <img src="/images/image2.png" />
                </div>
                <div className="flower-card flower-right">
                    <img src="/images/image3.png" />
                </div>
            </div>
            <h2> Wii Games Catalog </h2>
            <p> Welcome to the Wii Games Catalog, a React-based website retrieving your favorite Wii games. Feel free to favorite the games you want, click on them to see further information and search for specific games! </p>
        </div>
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for games..." 
                    className="search-input" 
                    value={searchQuery} 
                    onChange={handleInputChange}/>
                <button type="submit" onClick={() => console.log("Clicked!")} className="search-button">Search</button>
            </form>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
            <div className="games-grid">
                {allgames.map(
                    (game) => 
                        (
                         <GameCard game={game} key={game.id} />
                        )
                    )}
            </div>
            )}
        </div>
        </>
    )
}

export default Home
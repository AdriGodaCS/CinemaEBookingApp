import { useState } from 'react';
import MovieList from '../components/MovieList'
import './Home.css'

function Home() {

    const [inputTitle, setInputTitle] = useState("");
    const [genre, setGenre] = useState("");

    return (
        <section className="home-page" aria-labelledby="home-title">
            <div className="movie-search">
                <label htmlFor="movie-search-input">Search movies</label>
                <input
                    id="movie-search-input"
                    type="search"
                    value={inputTitle}
                    onChange={(event) => setInputTitle(event.target.value)}
                    placeholder="Search by title"
                />
            </div>
            <MovieList input={inputTitle} genre={genre} />
        </section>
    )
}

export default Home

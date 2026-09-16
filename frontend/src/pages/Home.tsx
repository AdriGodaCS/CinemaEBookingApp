import { useEffect, useState } from 'react'
import MovieList from '../components/MovieList'
import './Home.css'

type Movie = {
    genre: string
    status: string
}

function Home() {
    const [inputTitle, setInputTitle] = useState('')
    const [genre, setGenre] = useState('')
    const [genreOptions, setGenreOptions] = useState<string[]>([])

    // Load movie genres dynamically from the DB
    useEffect(() => {
        const fetchGenreOptions = async () => {
            const response = await fetch('http://localhost:8080/movies')

            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status}`)
            }

            const movies: Movie[] = await response.json()
            const movieGenreOptions = movies
                .filter(
                    (movie) =>
                        movie.status === 'Currently Running' ||
                        movie.status === 'Coming Soon',
                )
                .map((movie) => movie.genre.trim())
                .filter(Boolean)

            setGenreOptions([...new Set(movieGenreOptions)].sort((first, second) =>
                first.localeCompare(second),
            ))
        }

        fetchGenreOptions().catch((error: unknown) => {
            console.error('Failed to load movie GenreOptions:', error)
            setGenreOptions([])
        })
    }, [])

    return (
        <section className="home-page" aria-labelledby="home-title">
            <div className="movie-filters">
                <div className="movie-date-filter">
                    <p className="movie-date-filter-title">Filter by show date</p>
                    <div className="movie-date-fields">
                        <div>
                            <label htmlFor="movie-show-date-from">From</label>
                            <input id="movie-show-date-from" type="date" />
                        </div>
                        <div>
                            <label htmlFor="movie-show-date-to">To</label>
                            <input id="movie-show-date-to" type="date" />
                        </div>
                    </div>
                </div>
                <div className="movie-filter-main">
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
                    <div className="movie-genre-filter">
                        <label htmlFor="movie-genre-select">Filter by genre</label>
                        <select
                            id="movie-genre-select"
                            value={genre}
                            onChange={(event) => setGenre(event.target.value)}
                        >
                            <option value="">All genres</option>
                            {genreOptions.map((movieGenre) => (
                                <option key={movieGenre} value={movieGenre}>
                                    {movieGenre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <MovieList input={inputTitle} genre={genre} />
        </section>
    )
}

export default Home

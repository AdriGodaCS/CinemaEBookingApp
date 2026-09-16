import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import './MovieList.css'

type Movie = {
    id: number
    posterUrl: string
    title: string
    genre: string
    rating: string
    status: string
}

type MovieListProps = {
    input?: string
    genre?: string
}

function MovieList({ input, genre }: MovieListProps) {
    const [currentlyRunningMovies, setCurrentlyRunningMovies] = useState<Movie[]>([])
    const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('http://localhost:8080/movies')

            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status}`)
            }

            const movies: Movie[] = await response.json()
            const normalizedInput = (input ?? '').trim().toLowerCase()
            const normalizedGenre = (genre ?? '').trim().toLowerCase()

            const filteredMovies = movies.filter((movie) => {
                const matchesTitle =
                    normalizedInput === '' ||
                    movie.title.toLowerCase().includes(normalizedInput)
                const matchesGenre =
                    normalizedGenre === '' ||
                    movie.genre.toLowerCase() === normalizedGenre

                return matchesTitle && matchesGenre
            })

            setCurrentlyRunningMovies(
                filteredMovies.filter((movie) => movie.status === 'Currently Running'),
            )
            setComingSoonMovies(
                filteredMovies.filter((movie) => movie.status === 'Coming Soon'),
            )
        }

        fetchMovies().catch((error: unknown) => {
            console.error('Failed to load movies:', error)
            setCurrentlyRunningMovies([])
            setComingSoonMovies([])
        })
    }, [input, genre])

    return (
        <div data-input={input} data-genre={genre}>
            <section className="movie-section" aria-labelledby="currently-running-title">
                <div className="movie-section-heading">
                    <h2 id="currently-running-title">Currently Running</h2>
                </div>
                <div className="movie-grid">
                    {currentlyRunningMovies.length === 0 ? (
                        <p className="no-matching-movies">No matching movies found.</p>
                    ) : (
                        currentlyRunningMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                poster_url={movie.posterUrl}
                                title={movie.title}
                                genre={movie.genre}
                                rating={movie.rating}
                            />
                        ))
                    )}
                </div>
            </section>

            <section className="movie-section" aria-labelledby="coming-soon-title">
                <div className="movie-section-heading">
                    <h2 id="coming-soon-title">Coming Soon</h2>
                </div>
                <div className="movie-grid">
                    {comingSoonMovies.length === 0 ? (
                        <p className="no-matching-movies">No matching movies found.</p>
                    ) : (
                        comingSoonMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                poster_url={movie.posterUrl}
                                title={movie.title}
                                genre={movie.genre}
                                rating={movie.rating}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default MovieList

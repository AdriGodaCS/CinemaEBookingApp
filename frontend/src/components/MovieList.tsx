import { backendFacade } from '../services/BackendFacade'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
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

type Show = {
    showDate: string
    showTime: string
}

type MovieListProps = {
    input?: string
    genre?: string
}

const parseShowDateTime = (show: Show): Date => {
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(show.showDate)
    const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(show.showTime)

    if (!dateMatch || !timeMatch) {
        throw new Error(
            `Invalid show date/time: ${show.showDate} ${show.showTime}`,
        )
    }

    const [, year, month, day] = dateMatch
    const [, hour, minute, second = '0'] = timeMatch
    const parsedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
    )

    if (
        parsedDate.getFullYear() !== Number(year) ||
        parsedDate.getMonth() !== Number(month) - 1 ||
        parsedDate.getDate() !== Number(day) ||
        parsedDate.getHours() !== Number(hour) ||
        parsedDate.getMinutes() !== Number(minute) ||
        parsedDate.getSeconds() !== Number(second)
    ) {
        throw new Error(
            `Invalid show date/time: ${show.showDate} ${show.showTime}`,
        )
    }

    return parsedDate
}

function MovieList({
    input,
    genre,
}: MovieListProps) {
    const { user, isLoggedIn } = useAuth()

    const [currentlyRunningMovies, setCurrentlyRunningMovies] =
        useState<Movie[]>([])

    const [comingSoonMovies, setComingSoonMovies] =
        useState<Movie[]>([])

    const [favoriteMovieIds, setFavoriteMovieIds] =
        useState<Set<number>>(new Set())

    useEffect(() => {
        const fetchMovies = async () => {
            const movies =
                await backendFacade.getAllMovies() as Movie[]

            const normalizedInput =
                (input ?? '')
                    .trim()
                    .toLowerCase()

            const normalizedGenre =
                (genre ?? '')
                    .trim()
                    .toLowerCase()

            const now = new Date()
            const movieClassifications = await Promise.all(
                movies.map(async (movie) => {
                    const shows =
                        await backendFacade.getShowsByMovieId(movie.id) as Show[]
                    const hasFutureShow = shows.some(
                        (show) => parseShowDateTime(show) >= now,
                    )

                    return {
                        movie,
                        hasFutureShow,
                        hasNoShows: shows.length === 0,
                    }
                }),
            )

            const filteredMovies = movieClassifications.filter(
                ({ movie, hasFutureShow, hasNoShows }) => {
                    const matchesTitle =
                        normalizedInput === '' ||
                        movie.title.toLowerCase().includes(normalizedInput)
                    const matchesGenre =
                        normalizedGenre === '' ||
                        movie.genre.toLowerCase() === normalizedGenre

                    return (
                        matchesTitle &&
                        matchesGenre &&
                        (hasFutureShow || hasNoShows)
                    )
                },
            )

            setCurrentlyRunningMovies(
                filteredMovies
                    .filter(({ hasFutureShow }) => hasFutureShow)
                    .map(({ movie }) => movie),
            )

            setComingSoonMovies(
                filteredMovies
                    .filter(({ hasNoShows }) => hasNoShows)
                    .map(({ movie }) => movie),
            )
        }

        fetchMovies().catch(
            (error: unknown) => {
                console.error(
                    'Failed to load movies:',
                    error
                )

                setCurrentlyRunningMovies([])
                setComingSoonMovies([])
            }
        )
    }, [input, genre])

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isLoggedIn || !user) {
                setFavoriteMovieIds(new Set())
                return
            }

            try {
                const favorites =
                    await backendFacade.getFavorites(user.id) as Movie[]

                setFavoriteMovieIds(
                    new Set(
                        favorites.map(
                            (movie: Movie) =>
                                movie.id
                        )
                    )
                )
            } catch (error) {
                console.error(error)
            }
        }

        fetchFavorites()
    }, [user, isLoggedIn])

    const handleFavoriteAdded = (
        movieId: number
    ) => {
        setFavoriteMovieIds((prev) => {
            const updated = new Set(prev)
            updated.add(movieId)
            return updated
        })
    }

    const handleFavoriteRemoved = (
        movieId: number
    ) => {
        setFavoriteMovieIds((prev) => {
            const updated = new Set(prev)
            updated.delete(movieId)
            return updated
        })
    }

    return (
        <div
            data-input={input}
            data-genre={genre}
        >
            <section
                className="movie-section"
                aria-labelledby="currently-running-title"
            >
                <div className="movie-section-heading">
                    <h2 id="currently-running-title">
                        Currently Running
                    </h2>
                </div>

                <div className="movie-grid">
                    {currentlyRunningMovies.length ===
                        0 ? (
                        <p className="no-matching-movies">
                            No matching movies found.
                        </p>
                    ) : (
                        currentlyRunningMovies.map(
                            (movie) => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    poster_url={
                                        movie.posterUrl
                                    }
                                    title={movie.title}
                                    genre={movie.genre}
                                    rating={movie.rating}
                                    isFavorited={favoriteMovieIds.has(
                                        movie.id
                                    )}
                                    onFavorite={
                                        handleFavoriteAdded
                                    }
                                    onUnfavorite={
                                        handleFavoriteRemoved
                                    }
                                />
                            )
                        )
                    )}
                </div>
            </section>

            <section
                className="movie-section"
                aria-labelledby="coming-soon-title"
            >
                <div className="movie-section-heading">
                    <h2 id="coming-soon-title">
                        Coming Soon
                    </h2>
                </div>

                <div className="movie-grid">
                    {comingSoonMovies.length ===
                        0 ? (
                        <p className="no-matching-movies">
                            No matching movies found.
                        </p>
                    ) : (
                        comingSoonMovies.map(
                            (movie) => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    poster_url={
                                        movie.posterUrl
                                    }
                                    title={movie.title}
                                    genre={movie.genre}
                                    rating={movie.rating}
                                    isFavorited={favoriteMovieIds.has(
                                        movie.id
                                    )}
                                    onFavorite={
                                        handleFavoriteAdded
                                    }
                                />
                            )
                        )
                    )}
                </div>
            </section>
        </div>
    )
}

export default MovieList
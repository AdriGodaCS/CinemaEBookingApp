import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Movie } from '@/types/movie'
import type { Show } from '@/types/show'
import { backendFacade } from '@/services/BackendFacade'
import { fetchShowsForMovie } from '@/services/BookingApi'
import ShowtimesList from '@/components/ShowtimesList'
import { CastAndCrew } from '@/components/CastAndCrew'
import styles from './MovieDetails.module.css'

type MovieRoutParam = {
    id: string
}

export const MovieDetails = () => {
    const { id } = useParams<MovieRoutParam>();
    // Convert movie_id from a string to a number or NaN if movie_id is empty or undefined
    const movieId = id ? Number(id) : NaN;
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showtimes, setShowtimes] = useState<Show[]>([]);
    const [showtimesError, setShowtimesError] = useState<string | null>(null);
    
    // Load Movie info dynamically from the DB
    useEffect(() => {
        // Check if movie_id is a valid value
        if (isNaN(movieId)) {
            setError('Invalid movie ID provided in URL.');
            setIsLoading(false);
            return;
        }
        
        // Fetch movie data
        const fetchMovie = async () => {
            // Set UX
            setIsLoading(true);
            setError(null);
            
            try {
                const movieData = (await backendFacade.getMovieById(movieId)) as Movie | null | undefined;
                // The backend answers 200 with an empty body for an unknown movie id
                if (!movieData) {
                    throw new Error('No movie found.');
                }
                setMovie(movieData);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An error occcured';
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovie();
    }, [movieId])

    // Load this movie's showtimes dynamically from the DB, earliest first
    useEffect(() => {
        if (isNaN(movieId)) return;

        const loadShowtimes = async () => {
            setShowtimesError(null);
            try {
                const shows = await fetchShowsForMovie(movieId);
                setShowtimes(
                    [...shows].sort((a, b) =>
                        (a.showDate + a.showTime).localeCompare(b.showDate + b.showTime)
                    )
                );
            } catch (err) {
                console.error('Failed to load showtimes:', err);
                setShowtimes([]);
                setShowtimesError(err instanceof Error ? err.message : 'Failed to load showtimes.');
            }
        }
        loadShowtimes();
    }, [movieId])
    
    // Guard rendering
    if (isLoading) {
        return <div>Loading movie details...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    if (!movie) {
        return <div>No movie found.</div>
    }
    
    // Return details page
    return (
        <div className={styles['movie-details-page']}>
            <section className={styles.trailer}>
                <iframe
                    src={movie.trailerUrl}
                    title={movie.title}
                />
            </section>            
                <section className={styles['movie-details-info']}>
                    <img className={styles.poster} src={movie.posterUrl} alt="Movie poster"/>
                    <div>
                        <h1>{movie.title}</h1>
                        <ul className={styles['rating-genre']}>
                            <li>{movie.rating}</li>
                            <li>{movie.genre}</li>
                        </ul>
                        <p>{movie.description}</p>
                        <CastAndCrew movie={movie}/>
                          <section className={styles.reviews}>
                        {/*Render the reviews under the rest of the details */}
                        <h2>Reviews</h2>
                        <ul>
                            {movie.reviews.map((review) => (
                                <li key={review}>"{review}"</li>
                            ))}
                        </ul>
                    </section>
                    </div>                    
                </section>                        

            <section>
                <h3>Showtimes</h3>
                    <div>
                        {showtimesError ? (
                            <p role="alert">Showtimes could not be loaded. {showtimesError}</p>
                        ) : (
                            <ShowtimesList
                                showtimes={showtimes}
                                movieStatus={movie.status}
                            />
                        )}
                    </div>
            </section>
        </div>
    )
}
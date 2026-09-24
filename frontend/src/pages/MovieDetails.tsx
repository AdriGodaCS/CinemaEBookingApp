import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Movie } from '@/types/movie'
import type { Show } from '@/types/show'
import { mockShowtimes } from '@/types/show'
import ShowtimesList from '@/components/ShowtimesList'
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

    const [showtimes, setShowtimes] = useState<Show[]>(mockShowtimes);
    
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
                const response = await fetch(`http://localhost:8080/movies/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie details (Status: ${response.status})`);
                }
                const movieData: Movie = await response.json();
                setMovie(movieData);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An error occcured';
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovie();

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
                <img src={movie.posterUrl} alt="Movie poster"/>
                <div>
                    <h1>{movie.title}</h1>
                    <ul className={styles['rating-genre']}>
                        <li>{movie.rating}</li>
                        <li>{movie.genre}</li>
                    </ul>
                    <p>{movie.description}</p>
                    <dl>
                        <dt className={styles.miniTitle}>Movie Cast</dt>
                        <dd>
                            {movie.movieCast.map((cast) => {
                                return <p className={styles.cast}>{cast}</p>
                            })}
                        </dd>
                        <dt className={styles.miniTitle}>Director</dt>
                        <dd>{movie.director}</dd>
                        <dt className={styles.miniTitle}>Producer</dt>
                        <dd>{movie.producer}</dd>
                    </dl>
                </div>
                <button className={styles['fav-button']}>♡</button>
            </section>

            <section>
                <h3>Showtimes</h3>
                <div>
                    <ShowtimesList
                        showtimes={showtimes}
                    />
                </div>
            </section>
        </div>
    )
}
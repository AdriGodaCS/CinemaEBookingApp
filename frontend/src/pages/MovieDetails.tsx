import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Movie } from '@/types/movie'

type MovieRoutParam = {
    id: string
}

export const MovieDetails = () => {
    const { id } = useParams<MovieRoutParam>();
    // Convert movie_id to a number or NaN if movie_id is empty or undefined
    const movieId = id ? Number(id) : NaN;
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    
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
        <div>
            <section>
                <img src={movie.posterUrl} alt="Movie poster"/>
            </section>

            <section>
                <h1>{movie.title}</h1>
            </section>
        </div>
    )
}
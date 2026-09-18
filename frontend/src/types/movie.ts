import type {MovieCast} from '@/types/movieCast';

export interface Movie {
    description: string
    director: string
    genre: string
    id: number
    movieCast: MovieCast
    posterUrl: string
    producer: string
    rating: string
    status: string
    title: string
    trailerUrl: string
}
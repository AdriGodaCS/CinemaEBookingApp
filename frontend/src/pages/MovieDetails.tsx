import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Movie } from '@/types/movie'

const { movie_id } = useParams()

export const MovieDetails = () => {
    // Load Movie info dynamically from the DB
    useEffect(() => {
        
    }, [])

    return (
        <section>
            <h1>Movie Details</h1>
        </section>
    )
}
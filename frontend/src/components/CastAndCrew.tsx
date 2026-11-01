import { useState, useEffect } from "react";
import type { Movie } from "@/types/movie";
import styles from '@/pages/MovieDetails.module.css';

type CastAndCrewProp = {
    movie: Movie
}

export const CastAndCrew = ({ movie }: CastAndCrewProp) => {
    let castIndex = -1;
    
    
    return (
        <div>
            <p className={styles.miniTitle}>Movie Cast and Crew</p>
            <ul className={styles.cast}>
                <li>
                    <img src={movie.directorImageUrl} alt="Director headshot" width={200}/>
                    <p>{movie.director}</p>
                    <p className={styles.position}>Director</p>
                </li>
                <li>
                    <img src={movie.producerImageUrl} alt="Producer headshot"width={20}/>
                    <p>{movie.producer}</p>
                    <p className={styles.position}>Producer</p>
                </li>
                {
                    movie.movieCast.map((castName) => {
                        castIndex++;
                        return (
                        <li>
                            <img src={movie.movieCastImageUrls[castIndex]} alt={`${castName}'s headshot`} width={20}/>
                            <p>{castName}</p>
                        </li>
                    )})
                }
            </ul>
        </div>
       
    )
}
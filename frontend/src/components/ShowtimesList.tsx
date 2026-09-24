import React from 'react';
import type { Show } from '@/types/show'
import Showtime from '@/components/Showtime'
import './ShowtimesList.css'

type ShowtimesListProps = {
    showtimes: Show[]
}

function ShowtimesList({showtimes}:ShowtimesListProps) {
    
    return (
        <div className='showtimes-list'>
            {showtimes.length === 0 ? (
                <p>No matching showtimes found.</p>
            ) : (
                showtimes.map((show) => (
                    <Showtime
                        key={show.id}
                        show={show}
                    />
                ))
            )}
        </div>
    )
}

export default ShowtimesList
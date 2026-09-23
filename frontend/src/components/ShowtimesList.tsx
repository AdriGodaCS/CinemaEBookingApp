import React from 'react';
import type { Show } from '@/types/show'
import Showtime from '@/components/Showtime'

type ShowtimesListProps = {
    showtimes: Show[]
}

function ShowtimesList({showtimes}:ShowtimesListProps) {
    
    return (
        <div>
            {showtimes.length === 0 ? (
                <p>No matching movies found.</p>
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
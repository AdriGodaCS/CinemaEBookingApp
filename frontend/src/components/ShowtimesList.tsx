import React from 'react';
import type { Show } from '@/types/show'
import Showtime from '@/components/Showtime'

import styles from './ShowtimesList.module.css'

type ShowtimesListProps = {
    showtimes: Show[]
    movieStatus: string
}

function ShowtimesList({showtimes, movieStatus}:ShowtimesListProps) {
    
    return (
        <div>
            {(showtimes.length === 0) || movieStatus != 'Currently Running' ? (
                <div>
                    <p className={styles['coming-soon-message']}>No showtimes yet.</p>
                </div>
            ) : (
                <div className={styles['showtimes-list']}>
                    {showtimes.map((show) => (
                        <Showtime
                            key={show.id}
                            show={show}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ShowtimesList
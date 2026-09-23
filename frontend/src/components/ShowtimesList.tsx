import type { Show } from '@/types/show'
import Showtime from '@/components/Showtime'

type ShowtimesListProps = {
    id: number
    showtimes: Show[]
}

function ShowtimesList({showtimes}:ShowtimesListProps): ShowtimesListProps {
    
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
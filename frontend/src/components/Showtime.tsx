import { useParams } from 'react-router-dom'
import type { Show } from '@/types/show'
import { Link } from 'react-router-dom'
import './Showtime.css'

type MovieRoutParam = {
    id: string
}

type ShowtimeProps = {
    show: Show

}

const Showtime: React.FC<ShowtimeProps> = ({show}) => {
    const { id } = useParams<MovieRoutParam>();

    return (
        <Link to={`/movie/${id}/booking/${String(show.id)}`}>
            <article className="showtime-card">
                <p>{show.time}</p>
                <p>{show.date.toDateString()}</p>
            </article>
        </Link>
    )
};

export default Showtime;
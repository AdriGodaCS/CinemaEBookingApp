import { useParams } from 'react-router-dom'
import type { Show } from '@/types/show'
import { Link } from 'react-router-dom'

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
            <article>
                {show.time}
            </article>
        </Link>
    )
};

export default Showtime;
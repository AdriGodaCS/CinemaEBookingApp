import { Link } from 'react-router-dom'
import './MovieCard.css'

type MovieCardProps = {
  id: number
  poster_url?: string
  title?: string
  genre?: string
  rating?: number | string
  showFavoriteButton?: boolean

}

function MovieCard({ id, poster_url, title, genre, rating, showFavoriteButton = true }: MovieCardProps) {
  return (
    <div>
      <Link to={`/movie/${id}`} className="movie-card-link">
        <article className="movie-card">
          {poster_url && <img className="movie-poster" src={poster_url} alt={`${title ?? 'Movie'} poster`} />}
          <div className="movie-details">
            <h3>{title}</h3>
            <p>{genre}</p>
            <p>{rating}</p>
            {showFavoriteButton && (
              <button className="fav-button">
                ♡ Favorite
              </button>
            )}
          </div>
        </article>
      </Link>
    </div>
  )
}

export default MovieCard

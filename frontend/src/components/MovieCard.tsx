import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './MovieCard.css'

type MovieCardProps = {
  id: number
  poster_url?: string
  title?: string
  genre?: string
  rating?: number | string
  showFavoriteButton?: boolean
  isFavorited?: boolean
  onFavorite?: (movieId: number) => void
}

function MovieCard({
  id,
  poster_url,
  title,
  genre,
  rating,
  showFavoriteButton = true,
  isFavorited = false,
  onFavorite,
}: MovieCardProps) {
  const { user, isLoggedIn } = useAuth()

  const addFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user) return

    try {
      const response = await fetch(
        `http://localhost:8080/users/${user.id}/favorites/${id}`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add favorite')
      }

      onFavorite?.(id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Link
        to={`/movie/${id}`}
        className="movie-card-link"
      >
        <article className="movie-card">
          {poster_url && (
            <img
              className="movie-poster"
              src={poster_url}
              alt={`${title ?? 'Movie'} poster`}
            />
          )}

          <div className="movie-details">
            <h3>{title}</h3>

            <p>{genre}</p>

            <p>{rating}</p>

            {showFavoriteButton &&
              isLoggedIn &&
              !isFavorited && (
                <button
                  className="fav-button"
                  onClick={addFavorite}
                >
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
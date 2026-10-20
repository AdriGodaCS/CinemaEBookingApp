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
  onUnfavorite?: (movieId: number) => void
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
  onUnfavorite
}: MovieCardProps) {
  const { user, isLoggedIn } = useAuth()

  const handleFavoriteClick =
    async () => {

      if (!user) return

      try {

        const url = `http://localhost:8080/users/${user.id}/favorites/${id}`

        const response =
          await fetch(
            url,
            {
              method:
                isFavorited
                  ? 'DELETE'
                  : 'POST',
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem('token') ?? ''}`,
              },
            }
          )

        if (!response.ok) {
          return
        }

        if (isFavorited) {
          onUnfavorite?.(id)
        } else {
          onFavorite?.(id)
        }

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
              isLoggedIn && (
                <button
                  className={`fav-button ${isFavorited ? 'favorited' : ''
                    }`}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleFavoriteClick()
                  }}
                >
                  {isFavorited
                    ? '♥ Favorited'
                    : '♡ Favorite'}
                </button>
              )}
          </div>
        </article>
      </Link>
    </div>
  )
}

export default MovieCard
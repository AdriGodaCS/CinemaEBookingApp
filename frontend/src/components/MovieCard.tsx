import './MovieCard.css'

type MovieCardProps = {
  poster_url?: string
  title?: string
  genre?: string
  rating?: number | string
}

function MovieCard({ poster_url, title, genre, rating }: MovieCardProps) {
  return (
    <article className="movie-card">
      {poster_url && <img className="movie-poster" src={poster_url} alt={`${title ?? 'Movie'} poster`} />}
      <div className="movie-details">
        <h3>{title}</h3>
        <p>{genre}</p>
        <p>{rating}</p>
      </div>
    </article>
  )
}

export default MovieCard

function MovieCard() {
  return (
    <article className="movie-card" aria-label="Movie card placeholder">
      <div className="movie-poster" aria-hidden="true">
        <span>Poster</span>
      </div>
      <div className="movie-card-details">
        <div className="movie-card-line" />
        <div className="movie-card-line short" />
      </div>
    </article>
  )
}

export default MovieCard

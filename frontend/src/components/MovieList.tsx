import MovieCard from './MovieCard'

type MovieListProps = {
  input?: string
  genre?: string
}

const emptyCards = Array.from({ length: 4 })

function MovieList({ input, genre }: MovieListProps) {
  return (
    <div data-input={input} data-genre={genre}>
      <section className="movie-section" aria-labelledby="currently-running-title">
        <div className="movie-section-heading">
          <h2 id="currently-running-title">Currently Running</h2>
        </div>
        <div className="movie-grid">
          {emptyCards.map((_, index) => (
            <MovieCard key={`running-${index}`} />
          ))}
        </div>
      </section>

      <section className="movie-section" aria-labelledby="coming-soon-title">
        <div className="movie-section-heading">
          <h2 id="coming-soon-title">Coming Soon</h2>
        </div>
        <div className="movie-grid">
          {emptyCards.map((_, index) => (
            <MovieCard key={`coming-${index}`} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default MovieList

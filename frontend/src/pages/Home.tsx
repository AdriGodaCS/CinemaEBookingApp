import MovieCard from '../components/MovieCard'

const emptyCards = Array.from({ length: 4 })

function Home() {
  return (
    <section className="home-page" aria-labelledby="home-title">                

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
    </section>
  )
}

export default Home

import { useFavorites } from '../hooks/api'
import MovieCard from '../components/MovieCard'

export default function FavoritesPage() {
  const { data: favorites = [], isLoading, error } = useFavorites()

  return (
    <div className="container">
      <h1>My Favorite Movies</h1>

      {isLoading && <div className="loading">Loading favorites...</div>}
      {error && <div className="error">Error loading favorites: {(error as Error).message}</div>}

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>No favorite movies yet. Start adding some from the search page!</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map(movie => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

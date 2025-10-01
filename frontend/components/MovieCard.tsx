import { Movie } from '../hooks/api'
import { useFavorites, useAddToFavorites, useRemoveFromFavorites } from '../hooks/api'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { data: favorites = [] } = useFavorites()
  const addToFavorites = useAddToFavorites()
  const removeFromFavorites = useRemoveFromFavorites()

  const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID)

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites.mutate(movie.imdbID)
    } else {
      addToFavorites.mutate(movie)
    }
  }

  return (
    <div className="movie-card">
      <img 
        src={movie.Poster} 
        alt={movie.Title}
        className="movie-poster"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-poster.png'
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
        <button 
          onClick={handleFavoriteToggle}
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          disabled={addToFavorites.isPending || removeFromFavorites.isPending}
        >
          {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
      </div>
    </div>
  )
}

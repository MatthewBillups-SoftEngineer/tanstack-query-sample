import { useState } from 'react'
import { useSearchMovies } from '../hooks/api'
import MovieCard from '../components/MovieCard'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: movies = [], isLoading, error } = useSearchMovies(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="container">
      <h1>Movie Search</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading && <div className="loading">Searching movies...</div>}
      {error && <div className="error">Error searching movies: {(error as Error).message}</div>}

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>

      {searchQuery && movies.length === 0 && !isLoading && (
        <div className="no-results">No movies found for "{searchQuery}"</div>
      )}
    </div>
  )
}

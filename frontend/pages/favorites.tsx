import { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/api';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data: favorites = [], isLoading, error } = useFavorites();

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
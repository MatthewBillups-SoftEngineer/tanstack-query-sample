import { useState, useCallback, useEffect, useRef } from 'react';
import { useInfiniteSearchMovies, useFavorites } from '../hooks/api';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: favorites = [] } = useFavorites();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteSearchMovies(debouncedQuery);

  // Flatten all movies from all pages
  const allMovies = data?.pages.flatMap(page => page.movies) || [];

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
        {allMovies.map((movie, index) => {
          // Attach ref to the last movie element for infinite scroll
          const isLastMovie = index === allMovies.length - 1;
          return (
            <div
              key={movie.imdbID}
              ref={isLastMovie ? loadMoreRef : null}
            >
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>

      {/* Show loading indicator only for initial load, not for infinite scroll */}
      {isFetchingNextPage && (
        <div className="loading">Loading more movies...</div>
      )}

      {searchQuery && allMovies.length === 0 && !isLoading && (
        <div className="no-results">No movies found for "{searchQuery}"</div>
      )}
    </div>
  );
}
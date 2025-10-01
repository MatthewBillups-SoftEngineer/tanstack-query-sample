import { useState, useCallback, useEffect } from 'react';
import { useInfiniteSearchMovies, useFavorites } from '../hooks/api';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: favorites = [] } = useFavorites();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce

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

  // Intersection Observer for infinite scroll
  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.observe(node);

      return () => {
        if (node) observer.unobserve(node);
      };
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

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

      <div className="search-info">
        {debouncedQuery && data?.pages[0]?.totalResults && (
          <p className="results-count">
            Found {data.pages[0].totalResults} results for "{debouncedQuery}"
          </p>
        )}
      </div>

      <div className="movies-grid">
        {allMovies.map((movie, index) => {
          // Attach ref to the last movie element
          if (index === allMovies.length - 1) {
            return (
              <div key={movie.imdbID} ref={lastMovieElementRef}>
                <MovieCard movie={movie} />
              </div>
            );
          }
          return <MovieCard key={movie.imdbID} movie={movie} />;
        })}
      </div>

      {isFetchingNextPage && (
        <div className="loading-more">Loading more movies...</div>
      )}

      {debouncedQuery && allMovies.length === 0 && !isLoading && (
        <div className="no-results">No movies found for "{debouncedQuery}"</div>
      )}

      {!hasNextPage && allMovies.length > 0 && (
        <div className="end-of-results">No more movies to load</div>
      )}
    </div>
  );
}
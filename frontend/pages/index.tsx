import { useState, useCallback, useEffect, useRef } from 'react';
import { useInfiniteSearchMovies, useFavorites } from '../hooks/api';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

      {/* Show loading indicator when loading more pages */}
      {isFetchingNextPage && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          Loading more movies...
        </div>
      )}

      {/* Show load more button if there are more pages and not currently loading */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="load-more-container">
          <button
            onClick={handleLoadMore}
            className="load-more-btn"
          >
            Load More Movies
          </button>
        </div>
      )}

      {/* Show end message when no more pages */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="end-message">
          You've seen all the movies!
        </div>
      )}

      {searchQuery && allMovies.length === 0 && !isLoading && (
        <div className="no-results">No movies found for "{searchQuery}"</div>
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
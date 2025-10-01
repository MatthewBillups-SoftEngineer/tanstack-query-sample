import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface SearchResponse {
  movies: Movie[];
  totalResults: number;
  hasMore: boolean;
  nextPage?: number;
}

const API_BASE_URL = 'http://localhost:3001';

// Infinite scroll search
export const useInfiniteSearchMovies = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: async ({ pageParam = 1 }): Promise<SearchResponse> => {
      if (!query) {
        return {
          movies: [],
          totalResults: 0,
          hasMore: false
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${pageParam}`
      );
      if (!response.ok) throw new Error('Failed to search movies');
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    enabled: !!query,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Keep the existing simple search for comparison (optional)
export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async (): Promise<Movie[]> => {
      if (!query) return [];

      const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search movies');
      const data: SearchResponse = await response.json();
      return data.movies;
    },
    enabled: !!query,
  });
};

// Favorites hooks remain the same
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Movie[]> => {
      const response = await fetch(`${API_BASE_URL}/favorites`);
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return response.json();
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!response.ok) throw new Error('Failed to add to favorites');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imdbID: string) => {
      const response = await fetch(`${API_BASE_URL}/favorites/${imdbID}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
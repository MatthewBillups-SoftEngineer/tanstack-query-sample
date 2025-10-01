import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

const API_BASE_URL = 'http://localhost:3001'

// Search movies
export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async (): Promise<Movie[]> => {
      if (!query) return []

      const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to search movies')
      return response.json()
    },
    enabled: !!query,
  })
}

// Favorites
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Movie[]> => {
      const response = await fetch(`${API_BASE_URL}/favorites`)
      if (!response.ok) throw new Error('Failed to fetch favorites')
      return response.json()
    },
  })
}

export const useAddToFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (movie: Movie) => {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      })
      if (!response.ok) throw new Error('Failed to add to favorites')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (imdbID: string) => {
      const response = await fetch(`${API_BASE_URL}/favorites/${imdbID}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove from favorites')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

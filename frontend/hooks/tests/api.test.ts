import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfiniteSearchMovies, useFavorites, useAddToFavorites, useRemoveFromFavorites } from '../api';

// Mock fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
};

describe('API Hooks', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    describe('useInfiniteSearchMovies', () => {
        it('fetches movies successfully', async () => {
            const mockResponse = {
                movies: [
                    {
                        imdbID: 'tt1234567',
                        Title: 'Test Movie',
                        Year: '2023',
                        Poster: 'http://test.com/poster.jpg'
                    }
                ],
                totalResults: 1,
                hasMore: false
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const { result } = renderHook(() => useInfiniteSearchMovies('test'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('http://localhost:3001/movies/search?q=test&page=1');
        });

        it('handles fetch error', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

            const { result } = renderHook(() => useInfiniteSearchMovies('test'), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(new Error('API Error'));
        });

        it('does not fetch when query is empty', async () => {
            const { result } = renderHook(() => useInfiniteSearchMovies(''), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(fetch).not.toHaveBeenCalled();
        });
    });

    describe('useFavorites', () => {
        it('fetches favorites successfully', async () => {
            const mockFavorites = [
                {
                    imdbID: 'tt1234567',
                    Title: 'Favorite Movie',
                    Year: '2023',
                    Poster: 'http://test.com/poster.jpg'
                }
            ];

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockFavorites,
            });

            const { result } = renderHook(() => useFavorites(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockFavorites);
            expect(fetch).toHaveBeenCalledWith('http://localhost:3001/favorites');
        });

        it('handles favorites fetch error', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

            const { result } = renderHook(() => useFavorites(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(new Error('Network Error'));
        });
    });

    describe('useAddToFavorites', () => {
        it('adds movie to favorites', async () => {
            const mockMovie = {
                imdbID: 'tt1234567',
                Title: 'Test Movie',
                Year: '2023',
                Poster: 'http://test.com/poster.jpg'
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
            });

            const { result } = renderHook(() => useAddToFavorites(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(mockMovie);

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('http://localhost:3001/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockMovie),
            });
        });

        it('handles add to favorites error', async () => {
            const mockMovie = {
                imdbID: 'tt1234567',
                Title: 'Test Movie',
                Year: '2023',
                Poster: 'http://test.com/poster.jpg'
            };

            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to add'));

            const { result } = renderHook(() => useAddToFavorites(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(mockMovie);

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(new Error('Failed to add'));
        });
    });

    describe('useRemoveFromFavorites', () => {
        it('removes movie from favorites', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
            });

            const { result } = renderHook(() => useRemoveFromFavorites(), {
                wrapper: createWrapper(),
            });

            result.current.mutate('tt1234567');

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(fetch).toHaveBeenCalledWith('http://localhost:3001/favorites/tt1234567', {
                method: 'DELETE',
            });
        });

        it('handles remove from favorites error', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to remove'));

            const { result } = renderHook(() => useRemoveFromFavorites(), {
                wrapper: createWrapper(),
            });

            result.current.mutate('tt1234567');

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(new Error('Failed to remove'));
        });
    });
});
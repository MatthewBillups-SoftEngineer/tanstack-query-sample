import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieCard from '../MovieCard';

// Mock the API hooks
jest.mock('../../hooks/api', () => ({
    useFavorites: jest.fn(),
    useAddToFavorites: jest.fn(),
    useRemoveFromFavorites: jest.fn(),
}));

const { useFavorites, useAddToFavorites, useRemoveFromFavorites } = jest.requireMock('../../hooks/api');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

const mockMovie = {
    imdbID: 'tt1234567',
    Title: 'Test Movie',
    Year: '2023',
    Poster: 'http://test.com/poster.jpg'
};

describe('MovieCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementations
        useFavorites.mockReturnValue({
            data: []
        });

        useAddToFavorites.mockReturnValue({
            mutate: jest.fn(),
            isPending: false
        });

        useRemoveFromFavorites.mockReturnValue({
            mutate: jest.fn(),
            isPending: false
        });
    });

    it('renders movie information correctly', () => {
        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
        expect(screen.getByAltText('Test Movie')).toHaveAttribute('src', 'http://test.com/poster.jpg');
        expect(screen.getByText('☆ Add to Favorites')).toBeInTheDocument();
    });

    it('shows "Remove from Favorites" when movie is favorited', () => {
        useFavorites.mockReturnValue({
            data: [mockMovie]
        });

        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        expect(screen.getByText('★ Remove from Favorites')).toBeInTheDocument();
    });

    it('calls addToFavorites when clicking favorite button on non-favorited movie', async () => {
        const mockAddToFavorites = jest.fn();
        useAddToFavorites.mockReturnValue({
            mutate: mockAddToFavorites,
            isPending: false
        });

        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        const favoriteButton = screen.getByText('☆ Add to Favorites');
        fireEvent.click(favoriteButton);

        await waitFor(() => {
            expect(mockAddToFavorites).toHaveBeenCalledWith(mockMovie);
        });
    });

    it('calls removeFromFavorites when clicking favorite button on favorited movie', async () => {
        const mockRemoveFromFavorites = jest.fn();
        useRemoveFromFavorites.mockReturnValue({
            mutate: mockRemoveFromFavorites,
            isPending: false
        });
        useFavorites.mockReturnValue({
            data: [mockMovie]
        });

        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        const favoriteButton = screen.getByText('★ Remove from Favorites');
        fireEvent.click(favoriteButton);

        await waitFor(() => {
            expect(mockRemoveFromFavorites).toHaveBeenCalledWith(mockMovie.imdbID);
        });
    });

    it('disables button when mutation is pending', () => {
        useAddToFavorites.mockReturnValue({
            mutate: jest.fn(),
            isPending: true
        });

        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        const favoriteButton = screen.getByText('☆ Add to Favorites');
        expect(favoriteButton).toBeDisabled();
    });

    it('handles poster image error', () => {
        render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() });

        const image = screen.getByAltText('Test Movie');
        fireEvent.error(image);

        expect(image).toHaveAttribute('src', '/placeholder-poster.jpg');
    });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPage from '../index';

// Mock the hooks
jest.mock('../../hooks/api', () => ({
    useInfiniteSearchMovies: jest.fn(),
    useFavorites: jest.fn(),
}));

const { useInfiniteSearchMovies, useFavorites } = jest.requireMock('../../hooks/api');

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

describe('SearchPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useFavorites.mockReturnValue({
            data: [],
        });

        useInfiniteSearchMovies.mockReturnValue({
            data: { pages: [] },
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            error: null,
        });
    });

    it('renders search page correctly', () => {
        render(<SearchPage />, { wrapper: createWrapper() });

        expect(screen.getByText('Movie Search')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        useInfiniteSearchMovies.mockReturnValue({
            data: { pages: [] },
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: true,
            error: null,
        });

        render(<SearchPage />, { wrapper: createWrapper() });

        expect(screen.getByText('Searching movies...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        useInfiniteSearchMovies.mockReturnValue({
            data: { pages: [] },
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            error: new Error('API Error'),
        });

        render(<SearchPage />, { wrapper: createWrapper() });

        expect(screen.getByText('Error searching movies: API Error')).toBeInTheDocument();
    });

    it('handles search input', async () => {
        render(<SearchPage />, { wrapper: createWrapper() });

        const searchInput = screen.getByPlaceholderText('Search for movies...');
        fireEvent.change(searchInput, { target: { value: 'batman' } });

        await waitFor(() => {
            expect(searchInput).toHaveValue('batman');
        });
    });

    it('shows no results message', () => {
        useInfiniteSearchMovies.mockReturnValue({
            data: { pages: [] },
            fetchNextPage: jest.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            error: null,
        });

        render(<SearchPage />, { wrapper: createWrapper() });

        const searchInput = screen.getByPlaceholderText('Search for movies...');
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        expect(screen.getByText('No movies found for "nonexistent"')).toBeInTheDocument();
    });
});
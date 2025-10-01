import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { Movie } from '../movies/movies.service';

describe('FavoritesService', () => {
    let service: FavoritesService;

    const mockMovie: Movie = {
        imdbID: 'tt1234567',
        Title: 'Test Movie',
        Year: '2023',
        Poster: 'http://test.com/poster.jpg'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FavoritesService],
        }).compile();

        service = module.get<FavoritesService>(FavoritesService);
    });

    afterEach(() => {
        // Clear favorites between tests
        (service as any).favorites.clear();
    });

    describe('addToFavorites', () => {
        it('should add movie to favorites', () => {
            service.addToFavorites(mockMovie);

            const favorites = service.getFavorites();
            expect(favorites).toHaveLength(1);
            expect(favorites[0]).toEqual(mockMovie);
        });

        it('should not add duplicate movies', () => {
            service.addToFavorites(mockMovie);
            service.addToFavorites(mockMovie); // Add same movie again

            const favorites = service.getFavorites();
            expect(favorites).toHaveLength(1);
        });
    });

    describe('removeFromFavorites', () => {
        it('should remove movie from favorites', () => {
            service.addToFavorites(mockMovie);
            expect(service.getFavorites()).toHaveLength(1);

            service.removeFromFavorites(mockMovie.imdbID);
            expect(service.getFavorites()).toHaveLength(0);
        });

        it('should handle removing non-existent movie', () => {
            expect(() => {
                service.removeFromFavorites('nonexistent');
            }).not.toThrow();

            expect(service.getFavorites()).toHaveLength(0);
        });
    });

    describe('getFavorites', () => {
        it('should return empty array when no favorites', () => {
            const favorites = service.getFavorites();
            expect(favorites).toEqual([]);
        });

        it('should return all favorites', () => {
            const movie1: Movie = { ...mockMovie, imdbID: 'tt1' };
            const movie2: Movie = { ...mockMovie, imdbID: 'tt2' };

            service.addToFavorites(movie1);
            service.addToFavorites(movie2);

            const favorites = service.getFavorites();
            expect(favorites).toHaveLength(2);
            expect(favorites).toContainEqual(movie1);
            expect(favorites).toContainEqual(movie2);
        });
    });

    describe('isFavorite', () => {
        it('should return true for favorite movie', () => {
            service.addToFavorites(mockMovie);
            expect(service.isFavorite(mockMovie.imdbID)).toBe(true);
        });

        it('should return false for non-favorite movie', () => {
            expect(service.isFavorite('nonexistent')).toBe(false);
        });
    });
});
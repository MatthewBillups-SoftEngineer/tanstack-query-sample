import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
    let controller: MoviesController;
    let service: MoviesService;

    const mockMoviesService = {
        searchMovies: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: mockMoviesService,
                },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        service = module.get<MoviesService>(MoviesService);
    });

    describe('searchMovies', () => {
        it('should return search results', async () => {
            const mockResults = {
                movies: [
                    {
                        imdbID: 'tt1234567',
                        Title: 'Test Movie',
                        Year: '2023',
                        Poster: 'http://test.com/poster.jpg'
                    }
                ],
                totalResults: 1,
                nextPage: undefined,
                hasMore: false
            };

            mockMoviesService.searchMovies.mockResolvedValue(mockResults);

            const result = await controller.searchMovies('test');

            // The service should be called with both query and page (defaults to 1)
            expect(service.searchMovies).toHaveBeenCalledWith('test', 1);
            expect(result).toEqual(mockResults);
        });

        it('should call service with query and page number', async () => {
            const mockResults = {
                movies: [
                    {
                        imdbID: 'tt1234567',
                        Title: 'Test Movie',
                        Year: '2023',
                        Poster: 'http://test.com/poster.jpg'
                    }
                ],
                totalResults: 1,
                nextPage: undefined,
                hasMore: false
            };

            mockMoviesService.searchMovies.mockResolvedValue(mockResults);

            const result = await controller.searchMovies('tesla', '2');

            expect(service.searchMovies).toHaveBeenCalledWith('tesla', 2);
            expect(result).toEqual(mockResults)
        });

        it('should handle invalid page parameter', async () => {
            const mockResults = {
                movies: [],
                totalResults: 0,
                hasMore: false
            };

            mockMoviesService.searchMovies.mockResolvedValue(mockResults);

            const result = await controller.searchMovies('test', 'invalid');

            // Should default to page 1 for invalid page numbers
            expect(service.searchMovies).toHaveBeenCalledWith('test', 1);
            expect(result).toEqual(mockResults)
        });

        it('should call service with default page when no page provided', async () => {
            const mockResults = {
                movies: [
                    {
                        imdbID: 'tt1234567',
                        Title: 'Test Movie',
                        Year: '2023',
                        Poster: 'http://test.com/poster.jpg'
                    }
                ],
                totalResults: 1,
                nextPage: undefined,
                hasMore: false
            };

            mockMoviesService.searchMovies.mockResolvedValue(mockResults);

            const result = await controller.searchMovies('tesla');
            expect(service.searchMovies).toHaveBeenCalledWith('tesla', 1);
            expect(result).toEqual(mockResults)
        });
    });
});
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
    let service: MoviesService;
    let httpService: HttpService;
    let configService: ConfigService;

    const mockHttpService = {
        get: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('test-api-key'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                { provide: HttpService, useValue: mockHttpService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
        httpService = module.get<HttpService>(HttpService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('searchMovies', () => {
        it('should return empty array for empty query', async () => {
            const result = await service.searchMovies('');

            expect(result.movies).toEqual([]);
            expect(result.totalResults).toBe(0);
            expect(result.hasMore).toBe(false);
        });

        it('should return movies for valid query', async () => {
            const mockResponse = {
                data: {
                    Response: 'True',
                    Search: [
                        {
                            imdbID: 'tt1234567',
                            Title: 'Test Movie',
                            Year: '2023',
                            Poster: 'http://test.com/poster.jpg'
                        }
                    ],
                    totalResults: '1'
                }
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

            const result = await service.searchMovies('test');

            expect(result.movies).toHaveLength(1);
            expect(result.movies[0]).toEqual({
                imdbID: 'tt1234567',
                Title: 'Test Movie',
                Year: '2023',
                Poster: 'http://test.com/poster.jpg'
            });
            expect(result.totalResults).toBe(1);
            expect(result.hasMore).toBe(false);
        });

        // it('should handle API error', async () => {
        //     jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('API Error')));

        //     await expect(service.searchMovies('test')).rejects.toThrow('Failed to fetch movies from OMDb API');
        // });

        it('should handle no results', async () => {
            const mockResponse = {
                data: {
                    Response: 'False',
                    Error: 'Movie not found!'
                }
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

            const result = await service.searchMovies('nonexistent');

            expect(result.movies).toEqual([]);
            expect(result.totalResults).toBe(0);
            expect(result.hasMore).toBe(false);
        });

        it('should replace N/A poster with placeholder', async () => {
            const mockResponse = {
                data: {
                    Response: 'True',
                    Search: [
                        {
                            imdbID: 'tt1234567',
                            Title: 'Test Movie',
                            Year: '2023',
                            Poster: 'N/A'
                        }
                    ],
                    totalResults: '1'
                }
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

            const result = await service.searchMovies('test');

            expect(result.movies[0].Poster).toBe('/placeholder-poster.png');
        });
    });
});
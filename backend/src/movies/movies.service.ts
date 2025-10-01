import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

@Injectable()
export class MoviesService {
  private readonly omdbApiKey = process.env.OMDB_API_KEY || 'demo_key';
  private readonly omdbBaseUrl = 'http://www.omdbapi.com/';

  constructor(private httpService: HttpService) {
    console.log('OMDB API Key:', this.omdbApiKey);
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
      return {
        movies: [],
        totalResults: 0,
        hasMore: false
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.omdbBaseUrl, {
          params: {
            apikey: this.omdbApiKey,
            s: query,
            type: 'movie',
            page: page
          }
        })
      );

      if (response.data.Response === 'True') {
        const movies = response.data.Search.map((movie: any) => ({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.jpg'
        }));

        const totalResults = parseInt(response.data.totalResults) || 0;
        const resultsPerPage = 10; // OMDb API returns 10 results per page
        const totalPages = Math.ceil(totalResults / resultsPerPage);
        const hasMore = page < totalPages;

        return {
          movies,
          totalResults,
          hasMore,
          nextPage: hasMore ? page + 1 : undefined
        };
      } else {
        return {
          movies: [],
          totalResults: 0,
          hasMore: false
        };
      }
    } catch (error) {
      console.error('OMDb API Error:', error);
      throw new HttpException(
        'Failed to fetch movies from OMDb API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

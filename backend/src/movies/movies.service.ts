import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

@Injectable()
export class MoviesService {
  private readonly omdbApiKey = process.env.OMDB_API_KEY || 'demo_key';
  private readonly omdbBaseUrl = 'http://www.omdbapi.com/';

  constructor(private httpService: HttpService) {
    console.log('OMDB API Key:', this.omdbApiKey);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.omdbBaseUrl, {
          params: {
            apikey: this.omdbApiKey,
            s: query,
            type: 'movie'
          }
        })
      );

      if (response.data.Response === 'True') {
        return response.data.Search.map((movie: any) => ({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-poster.jpg'
        }));
      } else {
        return [];
      }
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movies from OMDb API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

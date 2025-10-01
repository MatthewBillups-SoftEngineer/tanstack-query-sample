import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService, Movie } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(@Query('q') query: string): Promise<Movie[]> {
    return this.moviesService.searchMovies(query);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService, SearchResponse } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('search')
  async searchMovies(
    @Query('q') query: string,
    @Query('page') page: string = '1'
  ): Promise<SearchResponse> {
    const pageNumber = parseInt(page) || 1;
    return this.moviesService.searchMovies(query, pageNumber);
  }
}
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Movie } from '../movies/movies.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  getFavorites(): Movie[] {
    return this.favoritesService.getFavorites();
  }

  @Post()
  addToFavorites(@Body() movie: Movie): void {
    this.favoritesService.addToFavorites(movie);
  }

  @Delete(':imdbID')
  removeFromFavorites(@Param('imdbID') imdbID: string): void {
    this.favoritesService.removeFromFavorites(imdbID);
  }
}

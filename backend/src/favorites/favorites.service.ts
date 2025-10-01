import { Injectable } from '@nestjs/common';
import { Movie } from '../movies/movies.service';

@Injectable()
export class FavoritesService {
  private favorites: Map<string, Movie> = new Map();

  addToFavorites(movie: Movie): void {
    this.favorites.set(movie.imdbID, movie);
  }

  removeFromFavorites(imdbID: string): void {
    this.favorites.delete(imdbID);
  }

  getFavorites(): Movie[] {
    return Array.from(this.favorites.values());
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites.has(imdbID);
  }
}

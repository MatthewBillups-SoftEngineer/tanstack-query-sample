import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MoviesModule,
    FavoritesModule,
  ],
})
export class AppModule {}

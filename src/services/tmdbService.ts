
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// You'll need to get this API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // Replace with your actual API key

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  credits?: {
    cast: { id: number; name: string; character: string }[];
    crew: { id: number; name: string; job: string }[];
  };
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  description: string;
  actors: string[];
  director: string;
}

const mapTMDBToMovie = (tmdbMovie: TMDBMovie | TMDBMovieDetails, genreMap: Record<number, string>): Movie => {
  const year = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 2024;
  const genre = tmdbMovie.genre_ids ? 
    tmdbMovie.genre_ids.map(id => genreMap[id]).filter(Boolean)[0] || 'Unknown' :
    'genres' in tmdbMovie ? tmdbMovie.genres[0]?.name || 'Unknown' : 'Unknown';
  
  const actors = 'credits' in tmdbMovie && tmdbMovie.credits ? 
    tmdbMovie.credits.cast.slice(0, 5).map(actor => actor.name) : 
    ['Cast information not available'];
  
  const director = 'credits' in tmdbMovie && tmdbMovie.credits ? 
    tmdbMovie.credits.crew.find(person => person.job === 'Director')?.name || 'Director not available' :
    'Director not available';

  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    year,
    genre: genre.toLowerCase(),
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` : '/placeholder.svg',
    description: tmdbMovie.overview || 'No description available.',
    actors,
    director
  };
};

export const tmdbService = {
  async getPopularMovies(page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      const genreMap = await this.getGenreMap();
      
      return data.results.map((movie: TMDBMovie) => mapTMDBToMovie(movie, genreMap));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      
      const data = await response.json();
      const genreMap = await this.getGenreMap();
      
      return data.results.map((movie: TMDBMovie) => mapTMDBToMovie(movie, genreMap));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies by genre');
      }
      
      const data = await response.json();
      const genreMap = await this.getGenreMap();
      
      return data.results.map((movie: TMDBMovie) => mapTMDBToMovie(movie, genreMap));
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  },

  async getGenreMap(): Promise<Record<number, string>> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }
      
      const data = await response.json();
      const genreMap: Record<number, string> = {};
      
      data.genres.forEach((genre: { id: number; name: string }) => {
        genreMap[genre.id] = genre.name;
      });
      
      return genreMap;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return {};
    }
  },

  getGenreIdByName(genreName: string): number {
    const genreMap: Record<string, number> = {
      'action': 28,
      'adventure': 12,
      'animation': 16,
      'comedy': 35,
      'crime': 80,
      'documentary': 99,
      'drama': 18,
      'family': 10751,
      'fantasy': 14,
      'history': 36,
      'horror': 27,
      'music': 10402,
      'mystery': 9648,
      'romance': 10749,
      'sci-fi': 878,
      'thriller': 53,
      'war': 10752,
      'western': 37
    };
    
    return genreMap[genreName.toLowerCase()] || 0;
  }
};

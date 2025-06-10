import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Bot, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MovieCard from '@/components/MovieCard';
import ApiKeyNotice from '@/components/ApiKeyNotice';
import { tmdbService, Movie } from '@/services/tmdbService';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const genres = ['all', 'action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance'];

  // Load popular movies on component mount
  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true);
      const popularMovies = await tmdbService.getPopularMovies();
      setMovies(popularMovies);
      setLoading(false);
    };

    loadPopularMovies();
  }, []);

  // Handle search
  useEffect(() => {
    const searchMovies = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        const results = await tmdbService.searchMovies(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle genre filtering
  useEffect(() => {
    const loadMoviesByGenre = async () => {
      if (selectedGenre !== 'all') {
        setLoading(true);
        const genreId = tmdbService.getGenreIdByName(selectedGenre);
        if (genreId) {
          const genreMovies = await tmdbService.getMoviesByGenre(genreId);
          setMovies(genreMovies);
        }
        setLoading(false);
      } else if (!searchTerm) {
        setLoading(true);
        const popularMovies = await tmdbService.getPopularMovies();
        setMovies(popularMovies);
        setLoading(false);
      }
    };

    loadMoviesByGenre();
  }, [selectedGenre]);

  const displayedMovies = searchTerm ? searchResults : movies;
  const isLoadingMovies = loading || isSearching;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">MovieFlix</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-purple-300 transition-colors">
                Home
              </Link>
              <Link to="/movie-bot">
                <Button variant="outline" className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700">
                  <Bot className="h-4 w-4 mr-2" />
                  Movie Bot
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <ApiKeyNotice />
          
          <h2 className="text-5xl font-bold text-white mb-6">
            Discover Your Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Favorite Movie
            </span>
          </h2>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-black/30 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className={`capitalize ${
                    selectedGenre === genre
                      ? "bg-purple-600 text-white"
                      : "bg-black/30 border-white/20 text-white hover:bg-purple-600/20"
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white mb-8">
            {searchTerm ? 'Search Results' : selectedGenre === 'all' ? 'Popular Movies' : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Movies`}
          </h3>
          
          {isLoadingMovies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-black/30 border border-white/10 rounded-lg animate-pulse">
                  <div className="h-64 bg-gray-700 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          
          {!isLoadingMovies && displayedMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No movies found. Try a different search term.' : 'No movies found. Try adjusting your filters.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Want Personalized Recommendations?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Chat with our AI Movie Bot to get recommendations based on your preferences, favorite actors, and mood.
          </p>
          <Link to="/movie-bot">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
              <Bot className="h-5 w-5 mr-2" />
              Start Chatting
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;

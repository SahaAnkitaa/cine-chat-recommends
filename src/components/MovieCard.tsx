
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Movie {
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

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Card className="bg-black/30 border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 group cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{movie.rating}</span>
          </div>
          <div className="absolute top-2 left-2 bg-purple-600/80 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-semibold">{movie.year}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{movie.title}</h3>
          <p className="text-purple-300 text-sm mb-2 capitalize">{movie.genre}</p>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{movie.description}</p>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 text-xs">Director: </span>
              <span className="text-gray-300 text-xs">{movie.director}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Stars: </span>
              <span className="text-gray-300 text-xs">{movie.actors.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;

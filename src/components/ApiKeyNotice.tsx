
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ApiKeyNotice = () => {
  return (
    <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-200">
        <strong>TMDB API Key Required:</strong> To use real movie data, you need to:
        <ol className="mt-2 ml-4 list-decimal">
          <li>Get a free API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline">TMDB</a></li>
          <li>Replace 'YOUR_TMDB_API_KEY_HERE' in src/services/tmdbService.ts with your actual API key</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyNotice;

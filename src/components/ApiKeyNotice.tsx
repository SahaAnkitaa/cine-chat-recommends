
import { CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ApiKeyNotice = () => {
  return (
    <Alert className="mb-6 bg-green-500/10 border-green-500/20">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-green-200">
        <strong>TMDB API Connected:</strong> Your movie bot is now connected to The Movie Database and ready to provide real movie recommendations!
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyNotice;

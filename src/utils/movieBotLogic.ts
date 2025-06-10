
import { mockMovies } from '@/data/mockMovies';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface UserPreferences {
  genres: string[];
  actors: string[];
  directors: string[];
  mood: string;
  rating: number;
}

const extractPreferences = (conversation: Message[]): UserPreferences => {
  const userMessages = conversation.filter(msg => !msg.isBot).map(msg => msg.text.toLowerCase());
  const allText = userMessages.join(' ');
  
  const genres = ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance'].filter(genre => 
    allText.includes(genre)
  );
  
  const actors = ['leonardo dicaprio', 'christian bale', 'keanu reeves', 'ryan gosling', 'bradley cooper', 'matthew mcconaughey']
    .filter(actor => allText.includes(actor.toLowerCase()));
  
  const directors = ['christopher nolan', 'quentin tarantino', 'james cameron']
    .filter(director => allText.includes(director.toLowerCase()));
  
  let mood = '';
  if (allText.includes('happy') || allText.includes('fun') || allText.includes('light')) {
    mood = 'happy';
  } else if (allText.includes('sad') || allText.includes('emotional') || allText.includes('cry')) {
    mood = 'emotional';
  } else if (allText.includes('scary') || allText.includes('thrilling') || allText.includes('intense')) {
    mood = 'intense';
  }
  
  let rating = 0;
  if (allText.includes('high rating') || allText.includes('best') || allText.includes('top rated')) {
    rating = 8.0;
  }
  
  return { genres, actors, directors, mood, rating };
};

const getMovieRecommendations = (preferences: UserPreferences): typeof mockMovies => {
  let recommendations = [...mockMovies];
  
  // Filter by genres
  if (preferences.genres.length > 0) {
    recommendations = recommendations.filter(movie => 
      preferences.genres.some(genre => movie.genre.toLowerCase().includes(genre))
    );
  }
  
  // Filter by actors
  if (preferences.actors.length > 0) {
    recommendations = recommendations.filter(movie => 
      preferences.actors.some(actor => 
        movie.actors.some(movieActor => 
          movieActor.toLowerCase().includes(actor)
        )
      )
    );
  }
  
  // Filter by directors
  if (preferences.directors.length > 0) {
    recommendations = recommendations.filter(movie => 
      preferences.directors.some(director => 
        movie.director.toLowerCase().includes(director)
      )
    );
  }
  
  // Filter by rating
  if (preferences.rating > 0) {
    recommendations = recommendations.filter(movie => movie.rating >= preferences.rating);
  }
  
  // Sort by rating (highest first)
  recommendations.sort((a, b) => b.rating - a.rating);
  
  return recommendations.slice(0, 5); // Return top 5
};

export const generateBotResponse = async (userInput: string, conversation: Message[]): Promise<string> => {
  const lowerInput = userInput.toLowerCase();
  const preferences = extractPreferences([...conversation, { id: 'temp', text: userInput, isBot: false, timestamp: new Date() }]);
  
  // First interaction - ask about genres
  if (conversation.length <= 2 && lowerInput.includes('hello')) {
    return "Hi there! 👋 I'm excited to help you find some amazing movies! Let's start with your favorite genres. Do you enjoy action, comedy, drama, horror, sci-fi, or romance? You can mention multiple genres!";
  }
  
  // If user mentions genres but we need more info
  if (preferences.genres.length > 0 && preferences.actors.length === 0 && !lowerInput.includes('actor')) {
    return `Great choice! I see you like ${preferences.genres.join(', ')} movies. 🎬 Now, do you have any favorite actors or actresses? This will help me narrow down the perfect recommendations for you!`;
  }
  
  // If user mentions actors but we could ask about mood
  if (preferences.actors.length > 0 && !preferences.mood && !lowerInput.includes('mood')) {
    return `Awesome! ${preferences.actors.join(' and ')} are fantastic! 🌟 One more question - what's your mood today? Are you looking for something happy and fun, emotional and deep, or maybe something intense and thrilling?`;
  }
  
  // Generate recommendations
  const recommendations = getMovieRecommendations(preferences);
  
  if (recommendations.length === 0) {
    return "Hmm, I couldn't find movies matching those exact preferences. Let me recommend some popular movies instead! How about The Dark Knight (action), Inception (sci-fi), or The Hangover (comedy)? Would any of these interest you?";
  }
  
  if (recommendations.length === 1) {
    const movie = recommendations[0];
    return `Perfect! Based on your preferences, I highly recommend "${movie.title}" (${movie.year}). It's a ${movie.genre} film with a ${movie.rating}/10 rating, starring ${movie.actors.slice(0, 2).join(' and ')}. ${movie.description} 🎬✨\n\nWould you like more recommendations or have any other preferences to share?`;
  }
  
  let response = "Based on your preferences, here are my top recommendations:\n\n";
  
  recommendations.forEach((movie, index) => {
    response += `${index + 1}. "${movie.title}" (${movie.year}) - ${movie.rating}/10 ⭐\n`;
    response += `   Genre: ${movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)}\n`;
    response += `   Stars: ${movie.actors.slice(0, 2).join(', ')}\n`;
    response += `   ${movie.description.slice(0, 80)}...\n\n`;
  });
  
  response += "Which one sounds interesting to you? Or would you like recommendations based on different preferences? 🎭";
  
  return response;
};

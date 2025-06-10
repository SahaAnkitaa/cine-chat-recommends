
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex items-start space-x-3 ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`rounded-full p-2 flex-shrink-0 ${
        message.isBot 
          ? 'bg-purple-600' 
          : 'bg-blue-600'
      }`}>
        {message.isBot ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>
      
      <div className={`rounded-lg px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg ${
        message.isBot 
          ? 'bg-gray-700/50 text-white' 
          : 'bg-blue-600 text-white ml-auto'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-2 ${
          message.isBot ? 'text-gray-400' : 'text-blue-100'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
}

type ChatInterfaceProps = {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string;
  onSubmit: (message: string) => void;
  onClearChat: () => void;
}

export function ChatInterface({ 
  chatHistory, 
  isLoading, 
  error, 
  onSubmit, 
  onClearChat 
}: ChatInterfaceProps) {
  const [userMessage, setUserMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    onSubmit(userMessage);
    setUserMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (!userMessage.trim()) return;
      
      onSubmit(userMessage);
      setUserMessage("");
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2 className="chat-title">AI Quote Assistant</h2>
        {chatHistory.length > 0 && (
          <Button
            onClick={onClearChat}
            variant="outline"
            size="sm"
            className="chat-clear-button"
          >
            Clear Chat
          </Button>
        )}
      </div>
      
      {/* Chat History Display */}
      {chatHistory.length > 0 && (
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
            >
              <div className={`chat-message-content ${message.role === 'user' ? 'chat-message-content-user' : 'chat-message-content-assistant'}`}>
                <p className="chat-message-text">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input-container">
          <label htmlFor="userMessage" className="chat-input-label">
            {chatHistory.length === 0 ? 'Describe your quote requirements' : 'Continue the conversation'}
          </label>
          <textarea
            id="userMessage"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={chatHistory.length === 0 
              ? "e.g., I need a quote for 100 enterprise software licenses with annual billing and volume discounts..."
              : "Ask follow-up questions or provide more details..."
            }
            className="chat-textarea"
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !userMessage.trim()}
          className="chat-submit-button"
        >
          {isLoading ? "Generating..." : (chatHistory.length === 0 ? "Generate Quote" : "Send Message")}
        </Button>
      </form>

      {error && (
        <div className="chat-error">
          <p className="chat-error-text">{error}</p>
        </div>
      )}
    </div>
  );
}

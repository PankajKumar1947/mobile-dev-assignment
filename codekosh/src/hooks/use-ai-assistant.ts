import { useState, useEffect } from 'react';
import { Snippet } from '../types/snippet';
import { getBaseUrl } from '../config/api';

export const useAiAssistant = (snippet: Snippet | null, visible: boolean) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize bot chat once snippet metadata loads or changes
  useEffect(() => {
    if (snippet) {
      setChatMessages([
        { sender: 'bot', text: `Hello! I am your CodeKosh AI assistant. How can I help you with "${snippet.title || 'this snippet'}" today?` }
      ]);
    }
  }, [snippet, visible]);

  const sendMessage = (text: string) => {
    const userMsg = { sender: 'user' as const, text };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages([...updatedMessages, { sender: 'bot', text: '' }]);
    setIsTyping(true);

    try {
      const baseUrl = getBaseUrl();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}/api/chat`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      let lastLength = 0;
      let accumulatedText = '';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const newText = xhr.responseText.substring(lastLength);
          if (newText) {
            lastLength = xhr.responseText.length;
            accumulatedText += newText;
            setChatMessages(prev => {
              const updated = [...prev];
              if (updated.length > 0) {
                updated[updated.length - 1] = { sender: 'bot', text: accumulatedText };
              }
              return updated;
            });
          }
        }
        if (xhr.readyState === 4) {
          setIsTyping(false);
          if (xhr.status !== 200) {
            console.error('Chat API error:', xhr.status, xhr.responseText);
            setChatMessages(prev => {
              const updated = [...prev];
              if (updated.length > 0) {
                updated[updated.length - 1] = {
                  sender: 'bot',
                  text: 'Sorry, I encountered an error. Please verify that the Expo server is running and the API key is configured.'
                };
              }
              return updated;
            });
          }
        }
      };

      xhr.onerror = (error) => {
        console.error('Chat AI network request error:', error);
        setIsTyping(false);
        setChatMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              sender: 'bot',
              text: 'Sorry, I encountered a network error. Please verify your connection and that the server is running.'
            };
          }
          return updated;
        });
      };

      xhr.send(
        JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          snippet: snippet ? {
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
          } : null,
        })
      );
    } catch (error: any) {
      console.error('Chat AI request execution error:', error);
      setIsTyping(false);
    }
  };

  return {
    chatMessages,
    isTyping,
    sendMessage,
  };
};

import React, { useState, useRef, useEffect } from 'react';
import { AppPlan, ItemFeedback } from '../types/plan';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  plan: AppPlan | null;
  onSendMessage: (message: string) => Promise<string>;
  onProvideFeedback: (feedback: ItemFeedback) => void;
  isLoading?: boolean;
}

const AIChat: React.FC<AIChatProps> = ({
  plan,
  onSendMessage,
  onProvideFeedback,
  isLoading = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Estou aqui para ajudar a desenvolver seu plano. Você pode me perguntar sobre qualquer aspecto ou sugerir modificações.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rolar para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Adicionar mensagem de boas-vindas quando o plano é carregado
  useEffect(() => {
    if (plan && messages.length === 1) {
      setMessages(prev => [
        ...prev,
        {
          id: 'plan-created',
          role: 'assistant',
          content: `Criei um plano para "${plan.title}". Você pode revisar cada item e me dizer se gostaria de fazer alguma alteração.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [plan]);

  // Enviar mensagem para a IA
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);
    
    try {
      const response = await onSendMessage(inputValue);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Formatar timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Renderizar uma mensagem
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div 
        key={message.id}
        className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div 
          className={`max-w-3/4 rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-500 dark:bg-blue-700">
        <h2 className="text-xl font-bold text-white">Chat com IA</h2>
        <p className="text-blue-100 text-sm">Converse para modificar o plano</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={isSending || isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || isLoading || !inputValue.trim()}
            className={`p-2 rounded-r-md ${
              isSending || isLoading || !inputValue.trim()
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSending ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Processando o plano... Por favor, aguarde.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChat;

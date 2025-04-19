import React, { useState, useEffect } from 'react';
import { Message } from './EnhancedChat';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ProgressCards } from './ProgressCards';
import { InteractiveForm } from './InteractiveForm';
import { ChoiceButtons } from './ChoiceButtons';
import { ResultPanel } from './ResultPanel';
import { SpeechButton } from './SpeechButton';
import { LedEffect } from '@/components/ui/led-effect';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, type, content } = message;
  const [isNew, setIsNew] = useState(true);

  // Efeito para desativar a animação após alguns segundos
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setIsNew(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Renderizar avatar do Nexus
  const renderAvatar = () => {
    if (role === 'assistant') {
      return (
        <div className="avatar-container flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-orange-500/30 bg-black/60">
          <img src="/nexus-avatar.png" alt="Nexus" className="w-full h-full object-cover" />
        </div>
      );
    }
    return null;
  };

  // Renderizar conteúdo da mensagem
  const renderContent = () => {
    switch (type) {
      case 'text':
        return <div className="text-message whitespace-pre-line">{content}</div>;

      case 'progress':
        return <ProgressCards steps={content.steps} />;

      case 'form':
        return <InteractiveForm fields={content.fields} />;

      case 'choices':
        return <ChoiceButtons choices={content.choices} />;

      case 'code':
        return (
          <div className="code-block mb-2 rounded-md overflow-hidden">
            <SyntaxHighlighter
              language={content.language || 'javascript'}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              {content.code}
            </SyntaxHighlighter>
          </div>
        );

      case 'result':
        return <ResultPanel result={content.result} />;

      default:
        return <div className="text-message">{JSON.stringify(content)}</div>;
    }
  };

  return (
    <div className={`chat-message flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' ? (
        <LedEffect
          active={isNew || type === 'progress'}
          color="orange"
          intensity={type === 'progress' ? 'medium' : 'low'}
          pulse={type === 'progress'}
          className="max-w-[80%]"
        >
          <div className={`message-container bg-black/60 border border-orange-500/20 rounded-lg p-3`}>
            <div className="flex gap-3">
              {renderAvatar()}

              <div className="message-content text-sm text-gray-200">
                {renderContent()}
              </div>

              {/* Botão de Text-to-Speech (apenas para mensagens de texto) */}
              {type === 'text' && typeof content === 'string' && (
                <div className="flex-shrink-0 ml-2 flex items-start">
                  <SpeechButton text={content} small={true} />
                </div>
              )}
            </div>
          </div>
        </LedEffect>
      ) : (
        <div className={`message-container max-w-[80%] bg-orange-500/10 border border-orange-500/30 rounded-lg p-3`}>
          <div className="flex gap-3">
            <div className="message-content text-sm text-gray-200">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

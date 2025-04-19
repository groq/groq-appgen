import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TerminalCommand } from '@/types/file-types';

interface TerminalViewProps {
  commands: TerminalCommand[];
  onCommandSubmit: (command: string) => void;
  onClear: () => void;
  onMaximize: () => void;
  isExecuting?: boolean;
}

export function TerminalView({
  commands,
  onCommandSubmit,
  onClear,
  onMaximize,
  isExecuting = false
}: TerminalViewProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Rolar para o final quando novos comandos são adicionados
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focar no input quando o componente é montado
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Lidar com a submissão do comando
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isExecuting) {
      onCommandSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="terminal-view flex flex-col h-full">
      <div className="terminal-header flex items-center justify-between p-2 border-b border-orange-500/20 bg-black/80">
        <div className="flex items-center">
          <TerminalIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          <span className="text-xs text-gray-300">Terminal</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-800/60"
            onClick={onClear}
            title="Limpar terminal"
          >
            <X className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onMaximize}
            title="Maximizar"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="terminal-content flex-1 bg-black/90 p-2 font-mono text-xs text-gray-300 overflow-y-auto"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        {commands.map((cmd, index) => (
          <div key={index} className="terminal-command mb-2">
            <div className="terminal-prompt flex">
              <span className="text-green-400 mr-1">nexus@gen</span>
              <span className="text-blue-400 mr-1">:~$</span>
              <span className="text-gray-200">{cmd.input}</span>
            </div>
            {cmd.output && (
              <div
                className="terminal-output mt-1 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: cmd.output }}
              />
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="terminal-input-line flex mt-2">
          <div className="terminal-prompt flex mr-1">
            <span className="text-green-400 mr-1">nexus@gen</span>
            <span className="text-blue-400 mr-1">:~$</span>
          </div>
          {isExecuting ? (
            <div className="flex items-center text-yellow-400">
              <Loader className="h-3 w-3 mr-1.5 animate-spin" />
              <span>Executando comando...</span>
            </div>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-200"
              autoComplete="off"
              spellCheck="false"
              disabled={isExecuting}
            />
          )}
        </form>
      </div>
    </div>
  );
}

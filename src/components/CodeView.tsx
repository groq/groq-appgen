import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Folder, File, ChevronDown, ChevronRight, Maximize2, Copy, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTreeItem[];
  content?: string;
  language?: string;
}

interface CodeViewProps {
  files: FileTreeItem[];
  onFileSelect: (file: FileTreeItem) => void;
  selectedFile?: FileTreeItem;
  onCodeChange?: (content: string) => void;
  onMaximize?: () => void;
}

export function CodeView({ files, onFileSelect, selectedFile, onCodeChange, onMaximize }: CodeViewProps) {
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({});
  
  // Alternar a expansão de um diretório
  const toggleDir = (path: string) => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Renderizar um item da árvore de arquivos
  const renderFileTreeItem = (item: FileTreeItem, level: number = 0) => {
    const isExpanded = expandedDirs[item.path] || false;
    
    return (
      <div key={item.path} style={{ marginLeft: `${level * 12}px` }}>
        <div 
          className={`file-tree-item flex items-center py-1 px-2 rounded-md text-xs cursor-pointer ${
            selectedFile?.path === item.path 
              ? 'bg-orange-500/20 text-orange-300' 
              : 'text-gray-300 hover:bg-gray-800/60'
          }`}
          onClick={() => {
            if (item.type === 'directory') {
              toggleDir(item.path);
            } else {
              onFileSelect(item);
            }
          }}
        >
          {item.type === 'directory' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              )}
              <Folder className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            </>
          ) : (
            <File className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          )}
          <span className="truncate">{item.name}</span>
        </div>
        
        {item.type === 'directory' && isExpanded && item.children && (
          <div className="file-tree-children">
            {item.children.map(child => renderFileTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="code-view flex h-full">
      {/* Árvore de arquivos */}
      <div className="file-tree w-64 border-r border-orange-500/20 bg-black/60 overflow-y-auto p-2">
        <div className="file-tree-header flex items-center justify-between mb-2 px-2">
          <h3 className="text-xs font-medium text-gray-300">Arquivos do Projeto</h3>
        </div>
        
        <div className="file-tree-content">
          {files.map(item => renderFileTreeItem(item))}
        </div>
      </div>
      
      {/* Editor de código */}
      <div className="code-editor flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="code-editor-header flex items-center justify-between p-2 border-b border-orange-500/20 bg-black/80">
              <div className="flex items-center">
                <File className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                <span className="text-xs text-gray-300">{selectedFile.path}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
                  onClick={() => {
                    if (selectedFile.content) {
                      navigator.clipboard.writeText(selectedFile.content);
                    }
                  }}
                  title="Copiar código"
                >
                  <Copy className="h-3.5 w-3.5" />
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
                
                <Button
                  size="sm"
                  className="h-7 px-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs"
                  title="Salvar"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
            
            <div className="code-editor-content flex-1 overflow-auto">
              {onCodeChange ? (
                <textarea
                  value={selectedFile.content}
                  onChange={(e) => onCodeChange(e.target.value)}
                  className="w-full h-full bg-black/90 text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none"
                />
              ) : (
                <SyntaxHighlighter
                  language={selectedFile.language || 'javascript'}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    height: '100%',
                    fontSize: '0.875rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  }}
                  showLineNumbers
                >
                  {selectedFile.content || ''}
                </SyntaxHighlighter>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-black/80 text-gray-400 text-sm">
            Selecione um arquivo para visualizar o código
          </div>
        )}
      </div>
    </div>
  );
}

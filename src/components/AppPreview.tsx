import React, { useState, useEffect } from 'react';

interface AppPreviewProps {
  html?: string;
  isGenerating?: boolean;
  progress?: number;
  error?: string;
}

const AppPreview: React.FC<AppPreviewProps> = ({
  html,
  isGenerating = false,
  progress = 0,
  error
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [iframeKey, setIframeKey] = useState(0); // Para forçar o recarregamento do iframe

  // Recarregar o iframe quando o HTML mudar
  useEffect(() => {
    if (html) {
      setIframeKey(prev => prev + 1);
    }
  }, [html]);

  // Renderizar o estado de carregamento
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Gerando aplicação...
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
          {progress < 25 && "Analisando requisitos..."}
          {progress >= 25 && progress < 50 && "Estruturando HTML..."}
          {progress >= 50 && progress < 75 && "Implementando lógica JavaScript..."}
          {progress >= 75 && progress < 100 && "Aplicando estilos CSS..."}
          {progress === 100 && "Finalizando..."}
        </div>
      </div>
    </div>
  );

  // Renderizar mensagem de erro
  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Erro na geração
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error || 'Ocorreu um erro ao gerar a aplicação. Por favor, tente novamente.'}
      </p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </div>
  );

  // Renderizar estado vazio
  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Nenhuma prévia disponível
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Aprove o plano para iniciar a geração da aplicação.
      </p>
    </div>
  );

  // Renderizar prévia da aplicação
  const renderPreview = () => {
    if (error) return renderError();
    if (isGenerating) return renderLoading();
    if (!html) return renderEmpty();
    
    return (
      <div className="h-full">
        <iframe
          key={iframeKey}
          srcDoc={html}
          title="App Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-forms"
        />
      </div>
    );
  };

  // Renderizar código da aplicação
  const renderCode = () => {
    if (error) return renderError();
    if (isGenerating) return renderLoading();
    if (!html) return renderEmpty();
    
    return (
      <div className="h-full overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {html}
        </pre>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-500 dark:bg-blue-700">
        <h2 className="text-xl font-bold text-white">Prévia da Aplicação</h2>
        <div className="mt-2 flex">
          <button
            className={`px-3 py-1 rounded-md text-sm mr-2 ${
              activeTab === 'preview'
                ? 'bg-white text-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Prévia
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === 'code'
                ? 'bg-white text-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Código
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? renderPreview() : renderCode()}
      </div>
    </div>
  );
};

export default AppPreview;

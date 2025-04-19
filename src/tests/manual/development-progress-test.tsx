import React, { useState } from 'react';
import { DevelopmentProgress, ProgressStep } from '@/components/DevelopmentProgress';
import { Button } from '@/components/ui/button';

export default function DevelopmentProgressTest() {
  const [steps, setSteps] = useState<ProgressStep[]>([
    {
      id: 'step1',
      title: 'Configurar o projeto',
      status: 'complete',
      description: 'Inicializar o projeto e instalar dependências'
    },
    {
      id: 'step2',
      title: 'Implementar componentes básicos',
      status: 'running',
      description: 'Criar os componentes fundamentais da aplicação'
    },
    {
      id: 'step3',
      title: 'Implementar funcionalidades principais',
      status: 'pending',
      description: 'Desenvolver as funcionalidades principais da aplicação'
    },
    {
      id: 'step4',
      title: 'Implementar autenticação',
      status: 'pending',
      description: 'Adicionar sistema de login e registro'
    },
    {
      id: 'step5',
      title: 'Implementar testes',
      status: 'pending',
      description: 'Adicionar testes unitários e de integração'
    }
  ]);
  
  const [files, setFiles] = useState([
    {
      path: 'src/index.js',
      content: `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`
    },
    {
      path: 'src/App.js',
      content: `import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <h1>Hello World</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;`
    },
    {
      path: 'src/components/Header.js',
      content: `import React from 'react';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;`
    }
  ]);
  
  const [commands, setCommands] = useState([
    'npm install',
    'npm start',
    'npm test'
  ]);
  
  const [logs, setLogs] = useState<string[]>([]);
  
  const handleViewFile = (path: string) => {
    setLogs(prev => [...prev, `Visualizando arquivo: ${path}`]);
  };
  
  const handleRunCommand = (command: string) => {
    setLogs(prev => [...prev, `Executando comando: ${command}`]);
  };
  
  const handleAdvanceProgress = () => {
    setSteps(prev => {
      const newSteps = [...prev];
      const runningIndex = newSteps.findIndex(step => step.status === 'running');
      
      if (runningIndex >= 0) {
        newSteps[runningIndex].status = 'complete';
        
        if (runningIndex + 1 < newSteps.length) {
          newSteps[runningIndex + 1].status = 'running';
        }
      }
      
      return newSteps;
    });
    
    setLogs(prev => [...prev, 'Avançando progresso']);
  };
  
  const handleFailStep = () => {
    setSteps(prev => {
      const newSteps = [...prev];
      const runningIndex = newSteps.findIndex(step => step.status === 'running');
      
      if (runningIndex >= 0) {
        newSteps[runningIndex].status = 'failed';
        newSteps[runningIndex].error = 'Erro ao executar o passo. Verifique os logs para mais detalhes.';
      }
      
      return newSteps;
    });
    
    setLogs(prev => [...prev, 'Falha no passo atual']);
  };
  
  const handleResetProgress = () => {
    setSteps([
      {
        id: 'step1',
        title: 'Configurar o projeto',
        status: 'complete',
        description: 'Inicializar o projeto e instalar dependências'
      },
      {
        id: 'step2',
        title: 'Implementar componentes básicos',
        status: 'running',
        description: 'Criar os componentes fundamentais da aplicação'
      },
      {
        id: 'step3',
        title: 'Implementar funcionalidades principais',
        status: 'pending',
        description: 'Desenvolver as funcionalidades principais da aplicação'
      },
      {
        id: 'step4',
        title: 'Implementar autenticação',
        status: 'pending',
        description: 'Adicionar sistema de login e registro'
      },
      {
        id: 'step5',
        title: 'Implementar testes',
        status: 'pending',
        description: 'Adicionar testes unitários e de integração'
      }
    ]);
    
    setLogs(prev => [...prev, 'Progresso reiniciado']);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste do DevelopmentProgress</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          onClick={handleAdvanceProgress}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
        >
          Avançar Progresso
        </Button>
        
        <Button
          onClick={handleFailStep}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
        >
          Falhar Passo Atual
        </Button>
        
        <Button
          onClick={handleResetProgress}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
        >
          Reiniciar Progresso
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Componente de Progresso</h2>
          
          <DevelopmentProgress
            steps={steps}
            files={files}
            commands={commands}
            onViewFile={handleViewFile}
            onRunCommand={handleRunCommand}
          />
        </div>
        
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Logs</h2>
          <div className="text-gray-300 font-mono text-sm max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhuma ação registrada</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="py-1 border-b border-gray-800">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

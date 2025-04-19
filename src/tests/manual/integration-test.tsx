import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlanningArtifact } from '@/components/PlanningArtifact';
import { VisualAnnotation } from '@/components/VisualAnnotation';
import { ElementSelectorNew as ElementSelector } from '@/components/ElementSelectorNew';
import { DevelopmentProgress, ProgressStep } from '@/components/DevelopmentProgress';
import { TemplateSelector } from '@/components/TemplateSelector';
import { ProjectTemplate, getAllTemplates } from '@/utils/project-templates';

export default function IntegrationTest() {
  // Estados para controlar quais componentes estão ativos
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  
  // Estados para os componentes
  const [planSteps, setPlanSteps] = useState([
    {
      id: 'objectives',
      title: 'Objetivos',
      description: 'Aplicativo de Gerenciamento de Tarefas: Um aplicativo web para gerenciar tarefas diárias e projetos.',
      tasks: [
        'Público-alvo: Profissionais e equipes que precisam organizar suas tarefas'
      ]
    },
    {
      id: 'requirements',
      title: 'Requisitos',
      description: 'Funcionalidades necessárias para o aplicativo',
      tasks: [
        'Autenticação de usuários (Alta)',
        'Criação, edição e exclusão de tarefas (Alta)',
        'Categorização de tarefas (Média)',
        'Definição de prazos e lembretes (Média)',
        'Compartilhamento de tarefas entre usuários (Baixa)'
      ]
    },
    {
      id: 'technologies',
      title: 'Tecnologias',
      description: 'Stack tecnológico para o desenvolvimento',
      tasks: [
        'Frontend: React, TypeScript, Tailwind CSS',
        'Backend: Node.js, Express',
        'Database: MongoDB',
        'Deployment: Vercel, MongoDB Atlas'
      ]
    },
    {
      id: 'architecture',
      title: 'Arquitetura',
      description: 'Estrutura e organização do projeto',
      tasks: [
        'Componentes: Frontend (SPA), Backend (API RESTful), Banco de Dados',
        'Fluxo de dados: Cliente <-> API <-> Banco de Dados'
      ]
    },
    {
      id: 'implementation',
      title: 'Implementação',
      description: 'Passos para implementar o projeto',
      tasks: [
        'Configuração do Projeto: Inicializar repositórios e configurar ambiente (1h)',
        'Implementação do Backend: Criar API e modelos de dados (3h)',
        'Implementação do Frontend: Criar interface e componentes (4h)',
        'Integração: Conectar frontend e backend (2h)',
        'Testes e Ajustes: Testar funcionalidades e corrigir bugs (2h)'
      ]
    }
  ]);
  
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: 'step1',
      title: 'Configuração do Projeto',
      status: 'complete',
      description: 'Inicializar repositórios e configurar ambiente'
    },
    {
      id: 'step2',
      title: 'Implementação do Backend',
      status: 'running',
      description: 'Criar API e modelos de dados'
    },
    {
      id: 'step3',
      title: 'Implementação do Frontend',
      status: 'pending',
      description: 'Criar interface e componentes'
    },
    {
      id: 'step4',
      title: 'Integração',
      status: 'pending',
      description: 'Conectar frontend e backend'
    },
    {
      id: 'step5',
      title: 'Testes e Ajustes',
      status: 'pending',
      description: 'Testar funcionalidades e corrigir bugs'
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
    }
  ]);
  
  const [imageUrl, setImageUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Gerar uma imagem de exemplo para o VisualAnnotation
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fundo
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 800, 600);
      
      // Cabeçalho
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, 800, 80);
      
      // Logo
      ctx.fillStyle = '#ff5500';
      ctx.fillRect(20, 20, 40, 40);
      
      // Título
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Exemplo de Interface', 80, 45);
      
      // Menu
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 80, 200, 520);
      
      // Itens do menu
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText('Dashboard', 20, 120);
      ctx.fillText('Usuários', 20, 160);
      ctx.fillText('Configurações', 20, 200);
      
      // Conteúdo
      ctx.fillStyle = '#222';
      ctx.fillRect(220, 100, 560, 480);
      
      // Cards
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(240 + i * 190, 120, 170, 120);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Card ${i + 1}`, 260 + i * 190, 150);
        
        ctx.fillStyle = '#aaa';
        ctx.font = '14px Arial';
        ctx.fillText('Descrição do card', 260 + i * 190, 180);
      }
      
      setImageUrl(canvas.toDataURL('image/png'));
    }
  }, []);
  
  // Funções para lidar com os componentes
  const handleActivateComponent = (component: string) => {
    setActiveComponent(component);
    setLogs(prev => [...prev, `Componente ativado: ${component}`]);
  };
  
  const handleCloseComponent = () => {
    setActiveComponent(null);
    setLogs(prev => [...prev, 'Componente fechado']);
  };
  
  // Funções para o PlanningArtifact
  const handleUpdatePlan = (updatedSteps: any[]) => {
    setPlanSteps(updatedSteps);
    setLogs(prev => [...prev, `Plano atualizado: ${updatedSteps.length} passos`]);
  };
  
  const handleStartExecution = () => {
    setActiveComponent(null);
    setActiveComponent('progress');
    setLogs(prev => [...prev, 'Execução iniciada']);
  };
  
  const handleSendPlanFeedback = (feedback: string) => {
    setLogs(prev => [...prev, `Feedback enviado: ${feedback}`]);
  };
  
  // Funções para o VisualAnnotation
  const handleProcessAnnotation = (annotatedImage: string, notes: string) => {
    setActiveComponent(null);
    setLogs(prev => [...prev, `Anotação processada com notas: ${notes || 'Nenhuma'}`]);
  };
  
  // Funções para o ElementSelector
  const handleElementFeedback = (elementPath: string, feedback: string) => {
    setActiveComponent(null);
    setLogs(prev => [...prev, `Feedback para elemento: ${elementPath}`]);
    setLogs(prev => [...prev, `Conteúdo do feedback: ${feedback}`]);
  };
  
  // Funções para o TemplateSelector
  const handleSelectTemplate = (template: ProjectTemplate) => {
    setActiveComponent(null);
    setLogs(prev => [...prev, `Template selecionado: ${template.name}`]);
  };
  
  // Funções para o DevelopmentProgress
  const handleViewFile = (path: string) => {
    setLogs(prev => [...prev, `Visualizando arquivo: ${path}`]);
  };
  
  const handleRunCommand = (command: string) => {
    setLogs(prev => [...prev, `Executando comando: ${command}`]);
  };
  
  const handleAdvanceProgress = () => {
    setProgressSteps(prev => {
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
    
    setLogs(prev => [...prev, 'Progresso avançado']);
  };
  
  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">Teste de Integração</h1>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Componentes</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              onClick={() => handleActivateComponent('planning')}
            >
              Ativar PlanningArtifact
            </Button>
            
            <Button
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              onClick={() => handleActivateComponent('annotation')}
            >
              Ativar VisualAnnotation
            </Button>
            
            <Button
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              onClick={() => handleActivateComponent('element')}
            >
              Ativar ElementSelector
            </Button>
            
            <Button
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              onClick={() => handleActivateComponent('template')}
            >
              Ativar TemplateSelector
            </Button>
            
            <Button
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
              onClick={() => handleActivateComponent('progress')}
            >
              Ativar DevelopmentProgress
            </Button>
            
            <Button
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
              onClick={handleAdvanceProgress}
            >
              Avançar Progresso
            </Button>
          </div>
        </div>
        
        <div className="bg-black/80 border border-orange-500/30 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-4">Logs</h2>
          
          <div className="logs-container h-[300px] overflow-y-auto bg-black/60 border border-gray-700 rounded-lg p-4">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhuma ação registrada</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="py-1 border-b border-gray-800 text-gray-300 text-sm">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Componentes ativos */}
      {activeComponent === 'planning' && (
        <div className="mb-8">
          <PlanningArtifact
            title="Plano de Desenvolvimento"
            description="Aplicativo de Gerenciamento de Tarefas"
            steps={planSteps}
            onUpdatePlan={handleUpdatePlan}
            onStartExecution={handleStartExecution}
            onSendFeedback={handleSendPlanFeedback}
          />
        </div>
      )}
      
      {activeComponent === 'progress' && (
        <div className="mb-8">
          <DevelopmentProgress
            steps={progressSteps}
            files={files.map(file => ({ path: file.path, content: file.content }))}
            commands={['npm install', 'npm start', 'npm test']}
            onViewFile={handleViewFile}
            onRunCommand={handleRunCommand}
          />
        </div>
      )}
      
      {/* Componentes de overlay */}
      {activeComponent === 'annotation' && (
        <VisualAnnotation
          imageUrl={imageUrl}
          onClose={handleCloseComponent}
          onSend={handleProcessAnnotation}
        />
      )}
      
      {activeComponent === 'element' && (
        <ElementSelector
          onClose={handleCloseComponent}
          onSendFeedback={handleElementFeedback}
        />
      )}
      
      {activeComponent === 'template' && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={handleCloseComponent}
        />
      )}
    </div>
  );
}

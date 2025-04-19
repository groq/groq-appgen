import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EnhancedChat, Message } from './EnhancedChat';
import { ViewSelector, ViewType } from './ViewSelector';
import { CodeView } from './CodeView';
import { PreviewView } from './PreviewView';
import { TerminalView } from './TerminalView';
import { AnalysisView } from './AnalysisView';
import { PlanningModule, PlanData } from './PlanningModule';
import { EnhancedPlanningModule } from './EnhancedPlanningModule';
import { VisualAnnotation } from './VisualAnnotation';
import { DevelopmentProgress, ProgressStep } from './DevelopmentProgress';
import { TemplateSelector } from './TemplateSelector';
import { ElementSelectorNew as ElementSelector } from './ElementSelectorNew';
import { processAnnotatedImage, processElementFeedback } from '@/utils/visual-feedback-service';
import { generateCodeFromPlan } from '@/utils/plan-execution-service';
import { ProjectTemplate } from '@/utils/project-templates';
import { SearchResult } from '@/utils/web-search';
import { FileTreeItem, TerminalCommand, AnalysisResult } from '@/types/file-types';
import { LedEffect } from '@/components/ui/led-effect';
import { SplashScreen } from '@/components/ui/splash-screen';

interface NexusFullStackProps {
  initialPrompt?: string;
}

export function NexusFullStack({ initialPrompt }: NexusFullStackProps) {
  // Estado para o chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estado para a pesquisa na web
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSummary, setSearchSummary] = useState('');

  // Estado para o planejamento
  const [isPlanningActive, setIsPlanningActive] = useState(false);
  const [isVisualAnnotationActive, setIsVisualAnnotationActive] = useState(false);
  const [isElementSelectorActive, setIsElementSelectorActive] = useState(false);
  const [isTemplateSelectorActive, setIsTemplateSelectorActive] = useState(false);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [annotationImageUrl, setAnnotationImageUrl] = useState('');
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [planData, setPlanData] = useState<PlanData>({
    objectives: {},
    requirements: [],
    technologies: {},
    architecture: {},
    implementation: []
  });

  // Estado para a visualização
  const [currentView, setCurrentView] = useState<ViewType>('preview');
  const [files, setFiles] = useState<FileTreeItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileTreeItem | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState('about:blank');
  const [isStartingServer, setIsStartingServer] = useState(false);

  // Estado para o terminal
  const [terminalCommands, setTerminalCommands] = useState<TerminalCommand[]>([]);
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);

  // Estado para a análise
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Inicializar com uma mensagem de boas-vindas
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: 'Olá! Sou o Nexus Gen, seu assistente de desenvolvimento full stack. Como posso ajudar você hoje?',
        timestamp: new Date()
      }
    ]);

    // Se houver um prompt inicial, enviar automaticamente
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Função para enviar uma mensagem
  const handleSendMessage = async (content: string) => {
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      type: 'text',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // Adicionar mensagem inicial
      const initialMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Vou ajudar você com "${content}". Primeiro, vamos analisar o que você precisa.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, initialMessage]);

      // Adicionar mensagem de progresso
      const progressMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'progress',
        content: {
          steps: [
            { title: "Analisando requisitos", status: "running", description: "Identificando as necessidades do projeto" },
            { title: "Pesquisando informações", status: "pending", description: "Buscando referências e melhores práticas" },
            { title: "Planejando arquitetura", status: "pending", description: "Definindo a estrutura do projeto" },
            { title: "Preparando ambiente", status: "pending", description: "Configurando dependências e estrutura de arquivos" },
            { title: "Gerando código", status: "pending", description: "Implementando funcionalidades" }
          ]
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev, progressMessage]);

      // Chamar a API do Agentic Tooling
      const response = await fetch('/api/agentic-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em desenvolvimento de software, capaz de criar aplicações completas com front-end e back-end. Use ferramentas como pesquisa na web e execução de código quando necessário.'
            },
            { role: 'user', content }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com a API');
      }

      const data = await response.json();

      // Atualizar mensagem de progresso
      const updatedProgressMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'progress',
        content: {
          steps: [
            { title: "Analisando requisitos", status: "complete", description: "Identificando as necessidades do projeto" },
            { title: "Pesquisando informações", status: "complete", description: "Buscando referências e melhores práticas" },
            { title: "Planejando arquitetura", status: "running", description: "Definindo a estrutura do projeto" },
            { title: "Preparando ambiente", status: "pending", description: "Configurando dependências e estrutura de arquivos" },
            { title: "Gerando código", status: "pending", description: "Implementando funcionalidades" }
          ]
        },
        timestamp: new Date()
      };

      setMessages(prev => [
        ...prev.filter(m => m.id !== progressMessage.id),
        updatedProgressMessage
      ]);

      // Processar tool_calls se houver
      if (data.tool_calls && data.tool_calls.length > 0) {
        // Processar chamadas de ferramentas
        for (const toolCall of data.tool_calls) {
          if (toolCall.function.name === 'web_search') {
            // Atualizar mensagem de progresso para mostrar pesquisa
            const searchProgressMessage: Message = {
              id: uuidv4(),
              role: 'assistant',
              type: 'text',
              content: `Estou pesquisando informações sobre "${JSON.parse(toolCall.function.arguments).query}"...`,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, searchProgressMessage]);

            // Simular resultados de pesquisa
            const results: SearchResult[] = [
              {
                title: 'React - A JavaScript library for building user interfaces',
                url: 'https://reactjs.org/',
                snippet: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render...',
                source: 'Google'
              },
              {
                title: 'Getting Started with React | React Documentation',
                url: 'https://reactjs.org/docs/getting-started.html',
                snippet: 'This page is an overview of the React documentation and related resources. React is a JavaScript library for building user interfaces.',
                source: 'Google'
              }
            ];

            setSearchResults(results);
            setSearchSummary('Encontrei informações relevantes sobre React, uma biblioteca JavaScript para construir interfaces de usuário.');
          }
        }
      }

      // Criar arquivos com base na resposta
      // Em uma implementação real, isso seria baseado na resposta da API
      const newFiles: FileTreeItem[] = [
        {
          name: 'src',
          type: 'directory',
          path: 'src',
          children: [
            {
              name: 'index.js',
              type: 'file',
              path: 'src/index.js',
              content: `import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(<App />, document.getElementById('root'));`,
              language: 'javascript'
            },
            {
              name: 'App.js',
              type: 'file',
              path: 'src/App.js',
              content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;`,
              language: 'javascript'
            }
          ]
        },
        {
          name: 'package.json',
          type: 'file',
          path: 'package.json',
          content: `{\n  "name": "example-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^17.0.2",\n    "react-dom": "^17.0.2"\n  }\n}`,
          language: 'json'
        }
      ];

      setFiles(newFiles);
      setSelectedFile(newFiles[0].children?.[0]);
      setPreviewUrl('https://example.com');

      // Atualizar mensagem de progresso final
      const finalProgressMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'progress',
        content: {
          steps: [
            { title: "Analisando requisitos", status: "complete", description: "Identificando as necessidades do projeto" },
            { title: "Pesquisando informações", status: "complete", description: "Buscando referências e melhores práticas" },
            { title: "Planejando arquitetura", status: "complete", description: "Definindo a estrutura do projeto" },
            { title: "Preparando ambiente", status: "complete", description: "Configurando dependências e estrutura de arquivos" },
            { title: "Gerando código", status: "complete", description: "Implementando funcionalidades" }
          ]
        },
        timestamp: new Date()
      };

      setMessages(prev => [
        ...prev.filter(m => m.id !== updatedProgressMessage.id),
        finalProgressMessage
      ]);

      // Adicionar comandos ao terminal
      setTerminalCommands([
        {
          input: 'npm init -y',
          output: 'Wrote to package.json',
          timestamp: new Date()
        },
        {
          input: 'npm install react react-dom',
          output: 'added 2 packages, and audited 3 packages in 2s',
          timestamp: new Date()
        },
        {
          input: 'mkdir src',
          output: '',
          timestamp: new Date()
        }
      ]);

      // Adicionar mensagem final
      const finalMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: data.response || `Pronto! Criei um aplicativo React básico para você. Você pode ver os arquivos na aba "Código" e a visualização na aba "Preview". Se quiser fazer alguma alteração ou tiver alguma dúvida, é só me avisar.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, finalMessage]);
      setIsGenerating(false);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsGenerating(false);
    }
  };

  // Função para otimizar o prompt
  const handleOptimizePrompt = () => {
    // Implementação real seria uma chamada à API
    console.log('Otimizando prompt...');
  };

  // Função para realizar pesquisa na web
  const handleSearch = async (query: string) => {
    setIsSearching(true);

    try {
      // Chamar a API do Agentic Tooling Mini (otimizado para pesquisa)
      const response = await fetch('/api/agentic-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente de pesquisa. Sua tarefa é buscar informações relevantes sobre o tópico fornecido.'
            },
            { role: 'user', content: `Pesquise informações sobre: ${query}` }
          ],
          mini: true,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com a API');
      }

      const data = await response.json();

      // Criar resultados de pesquisa com base na resposta
      // Em uma implementação real, isso seria baseado na resposta da API
      const results: SearchResult[] = [
        {
          title: `Resultados para: ${query}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: data.response.substring(0, 150) + '...',
          source: 'Groq Agentic Tooling'
        }
      ];

      // Processar tool_calls se houver
      if (data.tool_calls && data.tool_calls.length > 0) {
        // Processar chamadas de ferramentas
        for (const toolCall of data.tool_calls) {
          if (toolCall.function.name === 'web_search') {
            const args = JSON.parse(toolCall.function.arguments);
            results.push({
              title: `Pesquisa Web: ${args.query || query}`,
              url: `https://www.google.com/search?q=${encodeURIComponent(args.query || query)}`,
              snippet: 'Resultados da pesquisa web usando o Groq Agentic Tooling',
              source: 'Groq Agentic Tooling'
            });
          }
        }
      }

      setSearchResults(results);
      setSearchSummary(data.response || 'Pesquisa concluída com sucesso.');
      setIsSearching(false);

      // Adicionar mensagem informando sobre a pesquisa
      const searchMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Pesquisei na web sobre "${query}" e encontrei informações relevantes. Vou usar essas informações para ajudar a responder sua pergunta.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, searchMessage]);
    } catch (error) {
      console.error('Erro ao pesquisar na web:', error);
      setIsSearching(false);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: 'Desculpe, ocorreu um erro ao realizar a pesquisa na web. Por favor, tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Função para ativar um módulo
  const handleActivateModule = (module: 'optimize' | 'search' | 'plan' | 'visual-annotation' | 'element-selector' | 'template' | 'progress') => {
    if (module === 'search') {
      // Extrair a última mensagem do usuário para usar como consulta
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        handleSearch(lastUserMessage.content as string);
      }
    } else if (module === 'plan') {
      setIsPlanningActive(true);

      // Adicionar mensagem informando sobre o planejamento
      const planningMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: 'Vamos planejar seu projeto passo a passo. Por favor, preencha as informações solicitadas em cada etapa do planejamento.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, planningMessage]);
    } else if (module === 'optimize') {
      handleOptimizePrompt();
    } else if (module === 'visual-annotation') {
      // Capturar screenshot da área de preview
      const previewElement = document.querySelector('.preview-content');
      if (previewElement) {
        import('html2canvas').then(({ default: html2canvas }) => {
          html2canvas(previewElement as HTMLElement).then(canvas => {
            const imageUrl = canvas.toDataURL('image/png');
            setAnnotationImageUrl(imageUrl);
            setIsVisualAnnotationActive(true);
          });
        });
      }
    } else if (module === 'element-selector') {
      setIsElementSelectorActive(true);
    } else if (module === 'template') {
      setIsTemplateSelectorActive(true);
    } else if (module === 'progress') {
      setIsProgressVisible(true);
    }
  };

  // Função para atualizar o plano
  const handleUpdatePlan = (section: keyof PlanData, data: any) => {
    setPlanData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Função para finalizar o planejamento
  const handleFinishPlanning = async (plan: PlanData) => {
    setIsPlanningActive(false);

    // Adicionar mensagem com o resumo do plano
    const planSummaryMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      type: 'text',
      content: `Planejamento concluído! Vou criar um projeto com base nas informações fornecidas:\n\n- **Título**: ${plan.objectives.title}\n- **Descrição**: ${plan.objectives.description}\n- **Tecnologias Frontend**: ${plan.technologies.frontend?.join(', ') || 'Não especificado'}\n- **Tecnologias Backend**: ${plan.technologies.backend?.join(', ') || 'Não especificado'}\n\nVou começar a implementação agora.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, planSummaryMessage]);

    // Iniciar a geração com base no plano
    setIsGenerating(true);
    setIsProgressVisible(true);

    // Inicializar os passos de progresso
    const initialSteps: ProgressStep[] = plan.implementation.map(step => ({
      id: step.id,
      title: step.step,
      status: 'pending',
      description: step.description
    }));

    setProgressSteps(initialSteps);

    try {
      // Gerar código a partir do plano
      const result = await generateCodeFromPlan(plan);

      // Atualizar os passos de progresso
      setProgressSteps(result.steps);

      // Atualizar os arquivos
      setFiles(result.files);

      // Adicionar mensagem de conclusão
      const completionMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Implementação concluída! Foram criados ${result.files.length} arquivos.\n\nVocê pode visualizar os arquivos na aba "Código" e executar o projeto na aba "Terminal".`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, completionMessage]);

      // Adicionar mensagem com os comandos sugeridos
      if (result.commands.length > 0) {
        const commandsMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          type: 'text',
          content: `Comandos sugeridos para executar o projeto:\n\n${result.commands.map(cmd => `\`${cmd}\``).join('\n')}`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, commandsMessage]);
      }
    } catch (error) {
      console.error('Erro ao gerar código a partir do plano:', error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Ocorreu um erro ao gerar o código: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para lidar com a submissão de comando no terminal
  const handleCommandSubmit = async (command: string) => {
    // Adicionar comando ao terminal
    const newCommand: TerminalCommand = {
      input: command,
      output: `Executando: ${command}...`,
      timestamp: new Date()
    };

    setTerminalCommands(prev => [...prev, newCommand]);
    setIsExecutingCommand(true);

    try {
      // Executar comando no WebContainer
      const response = await fetch('/api/web-container', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'execute-command',
          command,
          options: {}
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao executar comando');
      }

      const data = await response.json();

      // Atualizar comando com a saída
      setTerminalCommands(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          output: data.stdout || data.stderr || `Comando executado com código de saída: ${data.exitCode}`
        };

        return updated;
      });
    } catch (error) {
      console.error('Erro ao executar comando:', error);

      // Atualizar comando com erro
      setTerminalCommands(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          output: `Erro ao executar comando: ${error instanceof Error ? error.message : String(error)}`
        };

        return updated;
      });
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // Função para limpar o terminal
  const handleClearTerminal = () => {
    setTerminalCommands([]);
  };

  // Função para iniciar o servidor
  const handleStartServer = async () => {
    if (isStartingServer || files.length === 0) return;

    setIsStartingServer(true);

    try {
      // Criar arquivos no WebContainer
      const createFilesResponse = await fetch('/api/web-container', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-files',
          files
        })
      });

      if (!createFilesResponse.ok) {
        throw new Error('Falha ao criar arquivos');
      }

      // Adicionar comando ao terminal
      const installCommand: TerminalCommand = {
        input: 'npm install',
        output: 'Instalando dependências...',
        timestamp: new Date()
      };

      setTerminalCommands(prev => [...prev, installCommand]);

      // Executar comando de instalação
      const installResponse = await fetch('/api/web-container', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'execute-command',
          command: 'npm install',
          options: {}
        })
      });

      if (!installResponse.ok) {
        throw new Error('Falha ao instalar dependências');
      }

      const installData = await installResponse.json();

      // Atualizar comando com a saída
      setTerminalCommands(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          output: installData.stdout || installData.stderr || 'Dependências instaladas com sucesso.'
        };

        return updated;
      });

      // Adicionar comando ao terminal
      const startCommand: TerminalCommand = {
        input: 'npm start',
        output: 'Iniciando servidor...',
        timestamp: new Date()
      };

      setTerminalCommands(prev => [...prev, startCommand]);

      // Iniciar servidor
      const startResponse = await fetch('/api/web-container', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start-server',
          command: 'npm start',
          options: {
            port: 3000
          }
        })
      });

      if (!startResponse.ok) {
        throw new Error('Falha ao iniciar servidor');
      }

      const startData = await startResponse.json();

      // Atualizar URL do preview
      setPreviewUrl(startData.url);

      // Atualizar comando com a saída
      setTerminalCommands(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        updated[lastIndex] = {
          ...updated[lastIndex],
          output: `Servidor iniciado com sucesso. URL: ${startData.url}`
        };

        return updated;
      });

      // Adicionar mensagem informando sobre o servidor
      const serverMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Servidor iniciado com sucesso. Você pode visualizar a aplicação na aba "Preview".`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, serverMessage]);
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Erro ao iniciar servidor: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStartingServer(false);
    }
  };

  // Função para executar análise UX
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // Capturar screenshot da página (em uma implementação real, isso seria feito com uma API de captura de tela)
      const screenshotUrl = 'https://via.placeholder.com/1200x800?text=Preview+Screenshot';

      // Chamar a API de visão para analisar a imagem
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: screenshotUrl,
          prompt: 'Analise esta interface de usuário e identifique problemas de usabilidade, acessibilidade, performance e design. Forneça uma pontuação de 0 a 100 para cada categoria e recomendações de melhoria.'
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com a API');
      }

      const data = await response.json();

      // Processar a resposta e criar resultados de análise
      // Em uma implementação real, isso seria baseado na resposta da API
      const results: AnalysisResult[] = [
        {
          title: 'Contraste de Cores',
          description: 'O contraste entre texto e fundo está adequado na maioria das áreas, mas alguns elementos têm contraste insuficiente.',
          score: 85,
          recommendations: [
            'Aumentar o contraste do texto secundário',
            'Revisar cores dos botões em estado hover'
          ],
          category: 'accessibility'
        },
        {
          title: 'Tempo de Carregamento',
          description: 'A aplicação carrega rapidamente, mas alguns recursos podem ser otimizados.',
          score: 92,
          recommendations: [
            'Implementar lazy loading para imagens',
            'Considerar code splitting para reduzir o tamanho do bundle inicial'
          ],
          category: 'performance'
        },
        {
          title: 'Usabilidade em Dispositivos Móveis',
          description: 'A interface é responsiva, mas alguns elementos têm tamanho inadequado para toque em dispositivos móveis.',
          score: 78,
          recommendations: [
            'Aumentar o tamanho dos botões para pelo menos 44x44px',
            'Melhorar espaçamento entre elementos clicáveis'
          ],
          category: 'design'
        }
      ];

      setAnalysisResults(results);
      setIsAnalyzing(false);

      // Adicionar mensagem informando sobre a análise
      const analysisMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: data.response || 'Concluí a análise da interface. Você pode ver os resultados na aba "Análise".',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Erro ao analisar interface:', error);
      setIsAnalyzing(false);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: 'Desculpe, ocorreu um erro ao analisar a interface. Por favor, tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Função para processar anotações visuais
  const handleProcessAnnotation = async (annotatedImage: string, notes: string) => {
    setIsVisualAnnotationActive(false);
    setIsGenerating(true);

    try {
      // Processar a imagem anotada
      const result = await processAnnotatedImage(annotatedImage, notes);

      // Adicionar mensagem com a interpretação
      const interpretationMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Analisei suas anotações visuais. Aqui está minha interpretação:\n\n${result.interpretation}\n\nSugestões de mudanças:\n${result.suggestedChanges.map((change, index) => `${index + 1}. ${change}`).join('\n')}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, interpretationMessage]);

      // Atualizar os arquivos se houver ações
      if (result.files && result.files.length > 0) {
        setFiles(prev => [...prev, ...result.files]);

        // Adicionar mensagem informando sobre os arquivos atualizados
        const filesMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          type: 'text',
          content: `Atualizei ${result.files.length} arquivo(s) com base nas suas anotações.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, filesMessage]);
      }
    } catch (error) {
      console.error('Erro ao processar anotações visuais:', error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Ocorreu um erro ao processar suas anotações: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para processar feedback sobre um elemento
  const handleElementFeedback = async (elementPath: string, feedback: string) => {
    setIsElementSelectorActive(false);
    setIsGenerating(true);

    try {
      // Processar o feedback sobre o elemento
      const result = await processElementFeedback(elementPath, feedback);

      // Adicionar mensagem com a interpretação
      const interpretationMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Recebi seu feedback sobre o elemento \`${elementPath}\`. Aqui está minha interpretação:\n\n${result.interpretation}\n\nSugestões de mudanças:\n${result.suggestedChanges.map((change, index) => `${index + 1}. ${change}`).join('\n')}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, interpretationMessage]);

      // Atualizar os arquivos se houver ações
      if (result.files && result.files.length > 0) {
        setFiles(prev => [...prev, ...result.files]);

        // Adicionar mensagem informando sobre os arquivos atualizados
        const filesMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          type: 'text',
          content: `Atualizei ${result.files.length} arquivo(s) com base no seu feedback.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, filesMessage]);
      }
    } catch (error) {
      console.error('Erro ao processar feedback sobre elemento:', error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        type: 'text',
        content: `Ocorreu um erro ao processar seu feedback: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para selecionar um template
  const handleSelectTemplate = (template: ProjectTemplate) => {
    setIsTemplateSelectorActive(false);
    setSelectedTemplate(template);

    // Atualizar os arquivos com os arquivos do template
    setFiles(template.files);

    // Adicionar mensagem informando sobre o template selecionado
    const templateMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      type: 'text',
      content: `Template selecionado: **${template.name}**\n\n${template.description}\n\nTecnologias: ${template.technologies.join(', ')}\n\nForam criados ${template.files.length} arquivos. Você pode visualizá-los na aba "Código".\n\nComandos para executar o projeto:\n${template.setupCommands.map(cmd => `\`${cmd}\``).join('\n')}\n\nComando para iniciar o servidor: \`${template.startCommand}\``,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, templateMessage]);
  };

  return (
    <div className="nexus-fullstack flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Splash screen durante a geração */}
      {isGenerating && (
        <div className="absolute inset-0 z-50">
          <SplashScreen
            state="coding"
            showText={true}
            fullScreen={true}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Componente de anotação visual */}
        {isVisualAnnotationActive && (
          <VisualAnnotation
            imageUrl={annotationImageUrl}
            onClose={() => setIsVisualAnnotationActive(false)}
            onSend={handleProcessAnnotation}
          />
        )}

        {/* Componente de seleção de elementos */}
        {isElementSelectorActive && (
          <div className="absolute inset-0 z-50">
            <ElementSelector
              onClose={() => setIsElementSelectorActive(false)}
              onSendFeedback={handleElementFeedback}
            />
          </div>
        )}

        {/* Componente de seleção de templates */}
        {isTemplateSelectorActive && (
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setIsTemplateSelectorActive(false)}
          />
        )}

        {/* Chat lateral (retrátil) */}
        <LedEffect
          active={isGenerating || isSearching}
          color="orange"
          intensity="low"
          pulse={true}
          className="w-80"
        >
          <div className="chat-sidebar w-full border-r border-orange-500/20 bg-black/60 flex flex-col rounded-r-lg">
            <EnhancedChat
              messages={messages}
              onSendMessage={handleSendMessage}
              onOptimizePrompt={handleOptimizePrompt}
              onSearch={handleSearch}
              onActivateModule={handleActivateModule}
              isGenerating={isGenerating}
              isSearching={isSearching}
              searchResults={searchResults}
              searchSummary={searchSummary}
            />
          </div>
        </LedEffect>

        {/* Área principal */}
        <div className="main-content flex-1 flex flex-col">
          {/* Seletor de visualização */}
          <ViewSelector
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          {/* Conteúdo da visualização */}
          <LedEffect
            active={isGenerating || isStartingServer || isAnalyzing || isExecutingCommand}
            color="orange"
            intensity="low"
            pulse={true}
            className="flex-1"
          >
            <div className="view-content flex-1 overflow-hidden rounded-lg">
              {/* Módulo de planejamento (sobrepõe a visualização quando ativo) */}
              {isPlanningActive && (
                <div className="planning-overlay absolute inset-0 bg-black/80 flex items-center justify-center z-10 p-4">
                  <EnhancedPlanningModule
                    onUpdatePlan={handleUpdatePlan}
                    onFinishPlanning={handleFinishPlanning}
                    planData={planData}
                    initialMode="artifact"
                  />
                </div>
              )}

              {/* Componente de progresso (sobrepõe a visualização quando ativo) */}
              {isProgressVisible && (
                <div className="progress-overlay absolute right-4 bottom-4 w-80 z-10">
                  <DevelopmentProgress
                    steps={progressSteps}
                    files={files.map(file => ({ path: file.path, content: file.content || '' }))}
                    commands={[]}
                    onViewFile={(path) => {
                      setCurrentView('code');
                      // Selecionar o arquivo na árvore de arquivos
                      const file = files.find(f => f.path === path);
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                    onRunCommand={(command) => {
                      setCurrentView('terminal');
                      handleCommandSubmit(command);
                    }}
                  />
                </div>
              )}

            {/* Visualização de código */}
            {currentView === 'code' && (
              <CodeView
                files={files}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onMaximize={() => console.log('Maximizar código')}
              />
            )}

            {/* Visualização de preview */}
            {currentView === 'preview' && (
              <PreviewView
                previewUrl={previewUrl}
                onRefresh={handleStartServer}
                onMaximize={() => console.log('Maximizar preview')}
                onOpenInBrowser={() => window.open(previewUrl, '_blank')}
                onCaptureSelection={() => console.log('Capturar seleção')}
                onAnnotate={() => handleActivateModule('visual-annotation')}
                onSelectElement={() => handleActivateModule('element-selector')}
                onAnalyze={handleRunAnalysis}
                isStartingServer={isStartingServer}
              />
            )}

            {/* Visualização de terminal */}
            {currentView === 'terminal' && (
              <TerminalView
                commands={terminalCommands}
                onCommandSubmit={handleCommandSubmit}
                onClear={handleClearTerminal}
                onMaximize={() => console.log('Maximizar terminal')}
                isExecuting={isExecutingCommand}
              />
            )}

            {/* Visualização de análise */}
            {currentView === 'analysis' && (
              <AnalysisView
                results={analysisResults}
                onRunAnalysis={handleRunAnalysis}
                onViewElement={(element) => console.log('Ver elemento:', element)}
                onDownloadReport={() => console.log('Baixar relatório')}
                onMaximize={() => console.log('Maximizar análise')}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
          </LedEffect>
        </div>
      </div>
    </div>
  );
}

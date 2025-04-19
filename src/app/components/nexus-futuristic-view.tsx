"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/share-button";
import { useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { LedEffect } from "@/components/ui/led-effect";
import { Code, Eye, Cpu, Sparkles, Check, ChevronLeft, ChevronRight, Plus, ArrowRight, RefreshCcw, Share2, Undo, Redo, HelpCircle, ImageIcon, Link, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS } from "@/utils/models";
import { MicrophoneButton } from "@/components/MicrophoneButton";

export default function NexusFuturisticView() {
  return (
    <Suspense>
      <FuturisticStudioContent />
    </Suspense>
  );
}

function FuturisticStudioContent() {
  const searchParams = useSearchParams();
  const {
    history,
    historyIndex,
    navigateHistory,
    currentHtml,
    isOverlayOpen,
    setIsOverlayOpen,
    getFormattedOutput,
    iframeRef,
    setHistory,
    setHistoryIndex,
    setCurrentHtml,
    setMode,
    sessionId,
    setStudioMode,
    isGenerating,
    isStreaming,
    streamingContent,
    streamingComplete,
    resetStreamingState,
    model,
    setModel,
    query,
    setQuery,
    currentFeedback,
    setCurrentFeedback,
    generateHtml,
    submitFeedback,
    mode,
  } = useStudio();

  const { resolvedTheme } = useTheme();
  const sourceLoadedRef = useRef(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showBoostMenu, setShowBoostMenu] = useState(false);
  const [boostIterations, setBoostIterations] = useState(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showNewProjectConfirm, setShowNewProjectConfirm] = useState(false);

  // Carregar versão de origem se fornecida na URL
  useEffect(() => {
    const source = searchParams.get("source");
    if (source && !sourceLoadedRef.current) {
      sourceLoadedRef.current = true;
      const loadSourceVersion = async () => {
        try {
          resetStreamingState();
          const [sourceSessionId, sourceVersion] = source.split("/");
          const response = await fetch(
            `/api/apps/${sourceSessionId}/${sourceVersion}/raw`
          );
          if (!response.ok) {
            throw new Error("Failed to load source version");
          }
          const html = await response.text();
          const newEntry = {
            sessionId: sourceSessionId,
            version: sourceVersion,
            html,
            query: "",
            signature: "",
          };
          setHistory([newEntry]);
          setHistoryIndex(0);
          setCurrentHtml(html);
          setMode("feedback");
          setStudioMode(true);
        } catch (error) {
          console.error("Error loading source version:", error);
          toast.error("Failed to load source version");
          sourceLoadedRef.current = false; // Reset if there was an error
        }
      };
      loadSourceVersion();
    }
  }, [
    searchParams,
    sessionId,
    setCurrentHtml,
    setHistory,
    setHistoryIndex,
    setMode,
    setStudioMode,
    resetStreamingState,
    isStreaming,
    streamingContent,
    streamingComplete,
  ]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "query") {
      if (query.trim()) {
        generateHtml();
        // Limpar o campo após envio
        setQuery("");
      }
    } else {
      if (currentFeedback.trim()) {
        submitFeedback();
        // Limpar o campo após envio
        setCurrentFeedback("");
      }
    }
  };

  // Função para lidar com transcrição do microfone
  const handleTranscription = (text: string) => {
    if (mode === "query") {
      setQuery((prev) => prev + " " + text);
    } else {
      setCurrentFeedback((prev) => prev + " " + text);
    }
    // Focar no input após a transcrição
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Função para aplicar boost de design
  const boostDesign = (type: 'layout' | 'colors' | 'spacing' | 'typography' | 'pro') => {
    if (!currentHtml) {
      toast.error("No content to enhance");
      return;
    }

    setShowBoostMenu(false);
    toast.loading(`Enhancing design: ${type}...`, { id: "boost-design" });

    // Simulação de melhoria de design
    setTimeout(() => {
      let feedback = "";

      switch (type) {
        case 'layout':
          feedback = "Please improve the layout of this interface. Make it more balanced, align elements properly, and ensure a better visual hierarchy.";
          break;
        case 'colors':
          feedback = "Enhance the color scheme of this interface. Use more vibrant and harmonious colors, improve contrast for better readability, and create a more cohesive color palette.";
          break;
        case 'spacing':
          feedback = "Fix the spacing in this interface. Ensure consistent margins and padding, improve whitespace distribution, and create better visual breathing room between elements.";
          break;
        case 'typography':
          feedback = "Improve the typography of this interface. Use better font sizes, weights, and line heights for improved readability and visual hierarchy.";
          break;
        case 'pro':
          feedback = `Apply a comprehensive design enhancement to this interface. Improve layout, colors, spacing, typography, and overall visual appeal. Make it look professional and polished. Apply ${boostIterations} iterations of improvements.`;
          break;
      }

      setCurrentFeedback(feedback);
      setMode("feedback");
      submitFeedback();
      toast.success(`Design enhancement started!`, { id: "boost-design" });
    }, 1000);
  };

  // Função para otimizar o prompt mantendo o idioma original
  const optimizePrompt = async () => {
    const currentText = mode === "query" ? query : currentFeedback;

    if (!currentText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    toast.loading("Optimizing your prompt...", { id: "optimize-prompt" });

    // Simulação de otimização de prompt
    // Em uma implementação real, isso enviaria o prompt para um modelo de linguagem
    setTimeout(() => {
      const isPortuguese = /[\u00C0-\u00FF]/.test(currentText) ||
                         /\b(e|o|a|os|as|um|uma|uns|umas|de|da|do|em|no|na|para)\b/.test(currentText.toLowerCase());

      let optimizedText = "";

      if (isPortuguese) {
        // Versão otimizada em português
        if (currentText.toLowerCase().includes("todo") || currentText.toLowerCase().includes("lista")) {
          optimizedText = `Crie uma aplicação de lista de tarefas (Todo List) com as seguintes características:
- Interface limpa e minimalista com fundo escuro
- Campo para adicionar novas tarefas
- Botão para adicionar tarefa
- Lista de tarefas com checkbox para marcar como concluídas
- Botão para excluir tarefas
- Contador de tarefas pendentes
- Filtros para mostrar todas as tarefas, apenas pendentes ou apenas concluídas
- Armazenamento local para persistir as tarefas mesmo após recarregar a página
- Design responsivo que funcione bem em dispositivos móveis e desktop`;
        } else {
          optimizedText = currentText + "\n\nPor favor, crie uma interface com design moderno, responsivo e intuitivo. Utilize cores contrastantes, tipografia legível e espaçamento adequado entre os elementos. Garanta que a experiência do usuário seja fluida e agradável.";
        }
      } else {
        // Versão otimizada em inglês
        if (currentText.toLowerCase().includes("todo") || currentText.toLowerCase().includes("list")) {
          optimizedText = `Create a Todo List application with the following features:
- Clean, minimalist interface with dark background
- Input field to add new tasks
- Add task button
- Task list with checkboxes to mark as completed
- Delete task button
- Pending tasks counter
- Filters to show all tasks, only pending, or only completed
- Local storage to persist tasks even after page reload
- Responsive design that works well on mobile and desktop devices`;
        } else {
          optimizedText = currentText + "\n\nPlease create an interface with modern, responsive, and intuitive design. Use contrasting colors, readable typography, and adequate spacing between elements. Ensure that the user experience is smooth and pleasant.";
        }
      }

      if (mode === "query") {
        setQuery(optimizedText);
      } else {
        setCurrentFeedback(optimizedText);
      }

      toast.success("Prompt optimized!", { id: "optimize-prompt" });

      // Focar no input após a otimização
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 1500);
  };



  return (
    <main className="h-screen flex flex-col overflow-hidden bg-black">
      {/* Barra superior com design angular e efeito de energia */}
      <div className="relative w-full h-16 flex items-center justify-between px-4 z-10">
        {/* Fundo e efeitos da barra superior */}
        <div className="absolute inset-0 bg-black border-b border-orange-500/30">
          {/* Forma angular da barra superior */}
          <div className="absolute inset-0 overflow-hidden">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <path
                d="M0,0 L15%,0 L20%,100% L10%,100% L0,100% Z"
                fill="#FF5500"
                fillOpacity="0.2"
              />
              <path
                d="M100%,0 L85%,0 L80%,100% L90%,100% L100%,100% Z"
                fill="#FF5500"
                fillOpacity="0.2"
              />
              <path
                d="M15%,0 L85%,0 L80%,100% L20%,100% Z"
                fill="transparent"
                stroke="#FF5500"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Conteúdo da barra superior */}
        <div className="flex items-center gap-2 z-10">
          {/* Logo Nexus Gen */}
          <div className="flex flex-col">
            <h1 className="font-montserrat text-[1.2em] font-bold">
              <span className="text-white">Nexus</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-gray-300 text-[0.85em]">Gen</span>
            </h1>
            <p className="text-xs text-gray-400">Powered by Groq</p>
          </div>

          {/* Botão de novo projeto */}
          <button
            className="ml-4 flex items-center justify-center px-3 py-1 rounded-md border border-orange-500/30 bg-black/40 text-orange-300 text-xs hover:bg-orange-500/20 transition-all duration-200"
            onClick={() => setShowNewProjectConfirm(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> New
          </button>

          {/* Diálogo de confirmação para novo projeto */}
          {showNewProjectConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-black border border-orange-500/50 rounded-lg p-6 max-w-md w-full shadow-lg shadow-orange-500/20">
                <h3 className="text-lg font-semibold text-white mb-2">Start New Project?</h3>
                <p className="text-gray-300 text-sm mb-4">Your current project will be saved and available in your projects list. Do you want to continue?</p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => setShowNewProjectConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
                    size="sm"
                    onClick={() => {
                      // Resetar o estado e voltar para a página inicial
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('interfaceVersion', 'futuristic');
                      }
                      setStudioMode(false);
                      setQuery("");
                      setHistory([]);
                      setHistoryIndex(-1);
                      setCurrentHtml("");
                      setMode("query");
                      setCurrentFeedback("");
                      resetStreamingState();
                      setShowNewProjectConfirm(false);
                    }}
                  >
                    Start New Project
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Controles de versão estilo desfazer/refazer */}
          <div className="flex items-center gap-1 ml-2">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-md border border-orange-500/30 bg-black/40 text-orange-300 hover:bg-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigateHistory("prev")}
              disabled={historyIndex <= 0}
              title="Undo - Previous Version"
            >
              <Undo className="h-3.5 w-3.5" />
            </button>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-md border border-orange-500/30 bg-black/40 text-orange-300 hover:bg-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigateHistory("next")}
              disabled={historyIndex >= history.length - 1}
              title="Redo - Next Version"
            >
              <Redo className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Botões de alternância entre código, preview e análise no centro */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex gap-2 bg-black/40 p-1 rounded-lg backdrop-blur-sm border border-gray-800/50">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-md px-3 py-1 text-xs ${viewMode === 'preview' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400'}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="h-3.5 w-3.5 mr-1" /> Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-md px-3 py-1 text-xs ${viewMode === 'code' ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400'}`}
              onClick={() => setViewMode('code')}
            >
              <Code className="h-3.5 w-3.5 mr-1" /> Code
            </Button>

          </div>
        </div>

        {/* Área vazia à direita (removemos os controles) */}
        <div className="flex items-center gap-2 z-10 invisible">
          <div className="w-20"></div>
        </div>
      </div>

      {/* Área principal de conteúdo */}
      <div className="flex-1 flex relative p-4">
        {/* Área para explorador de arquivos (esquerda) */}
        <div className="w-48 mr-2 relative hidden">
          {/* Conteúdo do explorador de arquivos - será implementado depois */}
          <div className="absolute inset-0 border border-orange-500/20 rounded-lg bg-black/60 overflow-auto">
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-2">Explorer</div>
              {/* Aqui entrará a estrutura de arquivos */}
            </div>
          </div>
        </div>

        {/* Área principal com visualização */}
        <div className="flex-1 relative mx-auto w-full max-w-6xl">
          {/* Efeito de borda futurística com energia circulando */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 border border-orange-500/30 rounded-lg">
              {/* Efeito de glow sutil ao redor da borda */}
              <div
                className={`absolute inset-0 rounded-lg opacity-30 transition-opacity duration-500 ${isGenerating ? 'opacity-70' : ''}`}
                style={{
                  boxShadow: 'inset 0 0 15px rgba(255, 165, 0, 0.3), 0 0 15px rgba(255, 165, 0, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}
              ></div>

              {/* Linha de energia percorrendo a borda */}
              <div className="absolute -inset-[1px] rounded-lg overflow-hidden z-[-1]">
                {/* Linhas horizontais */}
                <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
                  <div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow"
                       style={{ boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
                  <div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow"
                       style={{ animationDelay: '1s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
                </div>
                {/* Linhas verticais */}
                <div className="absolute top-0 left-0 h-full w-[2px] overflow-hidden">
                  <div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow"
                       style={{ animationDelay: '0.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
                </div>
                <div className="absolute top-0 right-0 h-full w-[2px] overflow-hidden">
                  <div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow"
                       style={{ animationDelay: '1.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Removidos botões duplicados de alternância entre código e preview */}

          {/* Conteúdo da visualização */}
          <div className="h-full w-full p-1 relative">
            {/* Indicador de carregamento */}
            <div
              className={cn(
                "absolute top-0 left-0 h-[2px] bg-orange-500 animate-loader z-10",
                isGenerating ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Visualização de código, preview ou análise */}
            <div className="h-full w-full overflow-hidden rounded-lg relative">
              {/* Visualização de código - sempre presente mas oculta quando não selecionada */}
              <div className={`absolute inset-0 h-full w-full overflow-auto ${viewMode === 'code' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                {isStreaming ? (
                  // Streaming content view
                  <div
                    className="h-full rounded font-mono text-sm overflow-auto p-4"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      backdropFilter: 'blur(5px)',
                      color: "#D4D4D4"
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></div>
                      <span className="text-xs text-orange-300">
                        Generating your app...
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {streamingContent || "Thinking..."}
                    </div>
                  </div>
                ) : (
                  // Code view
                  <SyntaxHighlighter
                    language="html"
                    style={vscDarkPlus}
                    className="h-full rounded"
                    customStyle={{
                      margin: 0,
                      height: "100%",
                      width: "100%",
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    {currentHtml || "<!-- HTML preview will appear here -->"}
                  </SyntaxHighlighter>
                )}

                <div className="absolute bottom-4 left-4">
                  <CopyButton code={currentHtml} />
                </div>
              </div>



              {/* Visualização de preview - sempre presente mas oculta quando não selecionada */}
              <div className={`absolute inset-0 h-full w-full ${viewMode === 'preview' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                <iframe
                  title="Studio Preview"
                  ref={iframeRef}
                  srcDoc={`<style>
                    body {
                      background-color: #000000 !important;
                      margin: 0;
                      padding: 20px;
                      overflow: auto;
                      box-sizing: border-box;
                      color: #e0e0e0;
                      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: flex-start;
                      min-height: 100vh;
                    }
                    /* Limitar o tamanho dos elementos para não ocuparem toda a tela */
                    .container, div[class*="container"], form, main, section, article, div {
                      max-width: 800px !important;
                      width: 100% !important;
                      margin-left: auto !important;
                      margin-right: auto !important;
                      box-sizing: border-box !important;
                    }
                    /* Esconder elementos de cadastro que não deveriam aparecer */
                    form:has(input[type="email"]), form:has(input[type="password"]) {
                      max-width: 400px !important;
                    }
                    /* Ajustes para Todo List e outros apps */
                    ul, ol, .list-container, [class*="list"] {
                      max-width: 600px !important;
                      width: 100% !important;
                      margin-left: auto !important;
                      margin-right: auto !important;
                    }
                    /* Ajustes para inputs e botões */
                    input, button, textarea, select {
                      max-width: 100% !important;
                      font-size: 14px !important;
                    }
                    /* Ajustes para cabeçalhos */
                    h1, h2, h3, h4, h5, h6 {
                      max-width: 800px !important;
                      margin-left: auto !important;
                      margin-right: auto !important;
                      text-align: center !important;
                    }
                    /* Ajustes para Todo List */
                    .todo-list, .todo-container, .todo-app, [class*="todo"] {
                      max-width: 500px !important;
                      width: 100% !important;
                      margin: 0 auto !important;
                    }
                    /* Ajustes para tamanho de fonte */
                    body, p, div, span, li {
                      font-size: 14px !important;
                    }
                    h1 { font-size: 24px !important; }
                    h2 { font-size: 20px !important; }
                    h3 { font-size: 18px !important; }
                    h4, h5, h6 { font-size: 16px !important; }
                    /* Barra de rolagem personalizada */
                    ::-webkit-scrollbar {
                      width: 8px;
                      height: 8px;
                    }
                    ::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                      background: rgba(255, 165, 0, 0.3);
                      border-radius: 4px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                      background: rgba(255, 165, 0, 0.5);
                    }
                  </style>${currentHtml}`}
                  className="w-full h-full border-0 rounded-lg bg-black"
                  style={{ minHeight: "100%", maxWidth: "100%", overflow: "hidden" }}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Painel lateral direito (Toolkit) */}
        <div className="w-12 ml-2 relative">
          {/* Botões circulares sem moldura */}
          <div className="flex flex-col items-center justify-center gap-5 py-6 relative z-10">
            {/* Botão 1 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-all duration-200"
              title="Feature 1"
            >
              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
            </button>

            {/* Botão 2 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-all duration-200"
              title="Feature 2"
            >
              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
            </button>

            {/* Botão 3 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-all duration-200"
              title="Feature 3"
            >
              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
            </button>

            {/* Botão 4 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-all duration-200"
              title="Feature 4"
            >
              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
            </button>

            {/* Botão 5 */}
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-all duration-200"
              title="Feature 5"
            >
              <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
            </button>
          </div>

          {/* Menu de seleção de modelo */}
          {showModelMenu && (
            <div
              className="absolute left-full ml-2 bottom-1/2 transform translate-y-1/2 w-80 bg-black border border-orange-500/30 rounded-md shadow-lg shadow-orange-500/10 z-50 animate-fade-in"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 15px rgba(255, 165, 0, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div className="p-1 max-h-[300px] overflow-y-auto scrollbar-hide">
                {MODEL_OPTIONS.map((modelOption) => {
                  // Usar o nome completo do modelo
                  const displayName = modelOption;
                  const isVision = modelOption.includes('vision');
                  const isCoder = modelOption.includes('coder');

                  return (
                    <div
                      key={modelOption}
                      className={`flex items-center justify-between px-2.5 py-1.5 cursor-pointer rounded-md mx-1 my-0.5 transition-all duration-200 ${model === modelOption ? 'bg-gradient-to-r from-orange-500/30 to-orange-500/10 text-orange-300' : 'text-gray-300 hover:bg-black/40 hover:text-orange-200'}`}
                      style={{
                        boxShadow: model === modelOption ? '0 0 8px rgba(255,165,0,0.15)' : 'none'
                      }}
                      onClick={() => {
                        setModel(modelOption);
                        setShowModelMenu(false);
                        toast.success(`Model changed to ${displayName}`);
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isVision ? 'bg-blue-400' : isCoder ? 'bg-green-400' : 'bg-orange-400'} ${model === modelOption ? 'animate-pulse' : ''}`}
                          style={{ boxShadow: `0 0 5px ${isVision ? 'rgba(59,130,246,0.5)' : isCoder ? 'rgba(74,222,128,0.5)' : 'rgba(251,146,60,0.5)'}` }}
                        ></div>
                        <span className="text-xs font-medium">{displayName}</span>
                      </div>
                      {model === modelOption && <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra inferior com campo de prompt */}
      <div className="relative w-full h-20 flex items-center justify-center px-4 z-10">
        {/* Fundo da barra inferior */}
        <div className="absolute inset-0 bg-black border-t border-orange-500/20">
          {/* Efeito de glow sutil */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              boxShadow: 'inset 0 0 10px rgba(255, 165, 0, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
          ></div>
        </div>

        {/* Campo de prompt estilo ChatGPT */}
        <form
          className="w-full max-w-xl relative z-10 flex items-center gap-2"
          onSubmit={handleSubmit}
        >
          {/* Botão de upload de imagem */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
            title="Upload Image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </button>

          {/* Botão de URL */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
            title="Enter URL"
          >
            <Link className="h-3.5 w-3.5" />
          </button>

          {/* Botão de boost de design */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-black/60 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200"
            title="Design Boost"
            onClick={() => setShowBoostMenu(!showBoostMenu)}
          >
            <Zap className="h-3.5 w-3.5" />
          </button>

          {/* Menu de boost de design */}
          {showBoostMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-64 bg-black/90 border border-orange-500/30 rounded-md shadow-lg z-50 animate-fade-in">
              <div className="p-3">
                <div className="text-xs font-medium text-gray-300 mb-2">Design Boost</div>

                <div className="space-y-2 mb-3">
                  <button
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-orange-500/20 text-gray-300"
                    onClick={() => boostDesign('layout')}
                  >
                    Improve Layout
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-orange-500/20 text-gray-300"
                    onClick={() => boostDesign('colors')}
                  >
                    Enhance Colors
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-orange-500/20 text-gray-300"
                    onClick={() => boostDesign('spacing')}
                  >
                    Fix Spacing
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-orange-500/20 text-gray-300"
                    onClick={() => boostDesign('typography')}
                  >
                    Improve Typography
                  </button>
                </div>

                <div className="border-t border-gray-800 pt-2 mb-2">
                  <div className="text-xs text-gray-400 mb-1.5">Iterations:</div>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-1 text-xs rounded ${boostIterations === 1 ? 'bg-orange-500/30 text-orange-300' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
                      onClick={() => setBoostIterations(1)}
                    >
                      1
                    </button>
                    <button
                      className={`flex-1 py-1 text-xs rounded ${boostIterations === 2 ? 'bg-orange-500/30 text-orange-300' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
                      onClick={() => setBoostIterations(2)}
                    >
                      2
                    </button>
                    <button
                      className={`flex-1 py-1 text-xs rounded ${boostIterations === 3 ? 'bg-orange-500/30 text-orange-300' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
                      onClick={() => setBoostIterations(3)}
                    >
                      3
                    </button>
                  </div>
                </div>

                <button
                  className="w-full py-1.5 text-xs rounded bg-gradient-to-r from-orange-600/40 to-orange-500/30 text-orange-300 hover:from-orange-600/50 hover:to-orange-500/40 border border-orange-500/30"
                  onClick={() => boostDesign('pro')}
                >
                  <span className="flex items-center justify-center gap-1">
                    <Zap className="h-3 w-3" /> Booster Pro
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="relative flex-1">
            {/* Campo de texto com efeito LED */}
            <LedEffect
              active={inputRef.current === document.activeElement || isGenerating}
              color="orange"
              intensity="medium"
              pulse={isGenerating}
              className="w-full"
            >
              <textarea
                ref={inputRef}
                value={mode === "query" ? query : currentFeedback}
                onChange={(e) => {
                  if (mode === "query") {
                    setQuery(e.target.value);
                  } else {
                    setCurrentFeedback(e.target.value);
                  }
                }}
                placeholder={mode === "query" ? "Describe your app or request changes..." : "Enter your feedback..."}
                className="w-full bg-black/60 border border-orange-500/30 text-gray-200 rounded-lg px-4 py-2 pr-12 resize-none h-10 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 placeholder-gray-500 text-sm"
                style={{
                  backdropFilter: 'blur(5px)',
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </LedEffect>

            {/* Botões dentro do campo */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {/* Botão de microfone */}
              <MicrophoneButton
                onTranscription={handleTranscription}
                small={true}
              />

              {/* Botão de otimização de prompt */}
              <button
                type="button"
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 transition-all duration-200"
                onClick={() => optimizePrompt()}
                title="Optimize Prompt"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>

              {/* Botão de modelo */}
              <button
                type="button"
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 text-gray-400 hover:text-orange-300 hover:bg-orange-500/20 transition-all duration-200 ${showModelMenu ? 'bg-orange-500/20 text-orange-300' : ''}`}
                onClick={() => setShowModelMenu(!showModelMenu)}
                title="Select Model"
              >
                <Cpu className="h-3.5 w-3.5" />
              </button>

              {/* Botão de envio */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-200 ${(mode === "query" ? query : currentFeedback).trim() ? 'bg-orange-500/10 text-orange-300' : 'text-gray-400'}`}
              >
                {isGenerating ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Indicador de progresso */}
        {isGenerating && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-1">
            <div className="h-full bg-orange-500/50 rounded-full animate-loader"></div>
          </div>
        )}
      </div>
    </main>
  );
}

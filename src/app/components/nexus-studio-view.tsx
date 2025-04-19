"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/share-button";
import { type HistoryEntry, useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { X, Code, Eye, Cpu, Sparkles, Zap } from "lucide-react";
import { VersionSwitcher } from "./version-switcher";
import { NewButton } from "./new-button";
import { OptionsButton } from "./options-button";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AppLogo from "@/components/AppLogo";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import ModelSelector from "@/components/model-selector";
import { MODEL_OPTIONS } from "@/utils/models";
import { MicrophoneButton } from "@/components/MicrophoneButton";

export default function NexusStudioView() {
  return (
    <Suspense>
      <StudioContent />
    </Suspense>
  );
}

function StudioContent() {
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
    isApplying,
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

  // Carregar versão de origem se necessário
  useEffect(() => {
    const source = searchParams.get("source");
    if (source && !sourceLoadedRef.current) {
      sourceLoadedRef.current = true;
      const loadSourceVersion = async () => {
        resetStreamingState();

        try {
          const response = await fetch(`/api/apps/${source}`);
          if (!response.ok) {
            throw new Error("Failed to load source version");
          }

          let html = "";
          let signature = "";
          const content = await response.text();
          if (content.startsWith("{")) {
            const json = JSON.parse(content);
            html = json.html;
            signature = json.signature;
          } else {
            html = content;
            throw new Error("This pre-release version is not supported");
          }
          const newEntry: HistoryEntry = {
            html,
            feedback: "",
            sessionId,
            version: "1",
            signature,
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

  // Fechar menu de modelos quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModelMenu && !(event.target as Element).closest('.model-menu-container') && !(event.target as Element).closest('.model-menu-button')) {
        setShowModelMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModelMenu]);

  // Função para lidar com a submissão do prompt
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "query") {
      generateHtml();
    } else {
      submitFeedback();
    }
  };

  // Função para lidar com a transcrição do microfone
  const handleTranscription = (transcription: string) => {
    if (mode === "query") {
      setQuery(transcription);
      generateHtml();
    } else {
      setCurrentFeedback(transcription);
      submitFeedback();
    }
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-black to-gray-950" style={{ backgroundColor: '#050505' }}>
      {/* Cabeçalho com logo e controles de versão */}
      <div className="flex justify-between items-center w-full px-4 py-2 border-b border-gray-800/30">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <h1 className="font-montserrat text-[1.2em] font-bold">
              <span className="text-white">Nexus</span>{" "}<span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-gray-300 text-[0.85em]">Gen</span>
            </h1>
            <p className="text-xs text-gray-400">Powered by Groq</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NewButton />
          <VersionSwitcher
            currentVersion={historyIndex + 1}
            totalVersions={history.length}
            onPrevious={() => navigateHistory("prev")}
            onNext={() => navigateHistory("next")}
          />
          <OptionsButton />
        </div>
      </div>

      {/* Área principal com visualização */}
      <div className="flex-1 flex flex-col relative overflow-hidden p-4">
        {/* Botões de alternância entre código e preview */}
        <div className="absolute top-4 left-4 z-10 flex gap-2 bg-black/40 p-1 rounded-lg backdrop-blur-sm border border-gray-800/50">
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

        {/* Botões de ação */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <ReloadButton iframeRef={iframeRef} />
          <ShareButton
            sessionId={history[historyIndex]?.sessionId}
            version={history[historyIndex]?.version}
            signature={history[historyIndex]?.signature}
            disabled={
              !history[historyIndex]?.sessionId ||
              !history[historyIndex]?.version
            }
          />
        </div>

        {/* Área de visualização com efeito neon */}
        <div className="flex-1 relative mx-auto w-full max-w-5xl">
          {/* Efeito de neon ao redor da área de visualização */}
          <div className="absolute inset-0 rounded-lg border border-orange-500/30 shadow-lg transition-all duration-300 ease-in-out hover:shadow-orange-500/50 focus-within:shadow-orange-500/70"
            style={{
              boxShadow: '0 0 15px rgba(255, 165, 0, 0.3), inset 0 0 10px rgba(255, 165, 0, 0.1)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}>
            {/* Efeito de neon ao redor */}
            <div
              className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-orange-500/70 via-orange-300/40 to-orange-500/70 blur-sm z-[-1] opacity-80"
              style={{ backgroundSize: '200% 100%', boxShadow: '0 0 15px rgba(255, 165, 0, 0.5)' }}
            />
            {/* Linha de energia percorrendo a borda */}
            <div
              className="absolute -inset-[1px] rounded-lg overflow-hidden z-[-1]"
            >
              {/* Linhas horizontais */}
              <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
                <div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow" style={{ boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
                <div className="absolute top-0 left-0 w-[30%] h-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '1s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
              </div>
              {/* Linhas verticais */}
              <div className="absolute top-0 left-0 h-full w-[2px] overflow-hidden">
                <div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '0.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
              </div>
              <div className="absolute top-0 right-0 h-full w-[2px] overflow-hidden">
                <div className="absolute top-0 left-0 h-[30%] w-full bg-orange-500 animate-energy-flow" style={{ animationDelay: '1.5s', boxShadow: '0 0 10px 2px rgba(255, 165, 0, 0.7)' }}></div>
              </div>
            </div>
          </div>

          {/* Conteúdo da visualização */}
          <div className="h-full w-full p-1 relative">
            {/* Indicador de carregamento */}
            <div
              className={cn(
                "absolute top-0 left-0 h-[2px] bg-orange-500 animate-loader z-10",
                isGenerating || isApplying ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Visualização de código ou preview */}
            <div className="h-full w-full overflow-hidden rounded-lg relative">
              {viewMode === 'code' ? (
                // Visualização de código
                <div className="h-full w-full overflow-auto">
                  {isStreaming ? (
                    // Streaming content view
                    <div
                      className="h-full rounded font-mono text-sm overflow-auto p-4"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
              ) : (
                // Visualização de preview
                <iframe
                  title="Studio Preview"
                  ref={iframeRef}
                  srcDoc={`<style>body{background-color:${resolvedTheme === "dark" ? "rgb(30 30 30)" : "#ffffff"};margin:0;}</style>${currentHtml}`}
                  className="w-full h-full border-0 rounded-lg bg-background"
                  style={{ minHeight: "100%", minWidth: "100%" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Área de input na parte inferior */}
      <div className="w-full px-4 py-4 border-t border-gray-800/30 bg-black/20 backdrop-blur-sm">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col relative max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2">
            {/* Input de texto */}
            <div className="flex-1 relative">
              <textarea
                value={mode === "query" ? query : currentFeedback}
                onChange={(e) => mode === "query" ? setQuery(e.target.value) : setCurrentFeedback(e.target.value)}
                className="w-full h-[3rem] p-3 text-sm bg-transparent focus:outline-none resize-none rounded transition-all duration-300 ease-in-out placeholder-gray-500 focus:placeholder-orange-300 border-none"
                placeholder={mode === "query" ? "Describe your app or request changes..." : "Enter your feedback..."}
                style={{
                  backdropFilter: 'blur(5px)',
                }}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-2">
              {/* Botão de seleção de modelo */}
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 model-menu-button ${showModelMenu ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-orange-300'}`}
                  onClick={() => setShowModelMenu(!showModelMenu)}
                >
                  <Cpu className="h-3.5 w-3.5" />
                </Button>

                {/* Menu de modelos */}
                {showModelMenu && (
                  <div
                    className="absolute right-0 bottom-full mb-2 w-[210px] rounded-lg shadow-lg overflow-hidden z-50 model-menu-container animate-fade-in"
                    style={{
                      backdropFilter: 'blur(10px)',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255,165,0,0.2)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,165,0,0.2)',
                    }}
                  >
                    <div className="p-1.5">
                      <div className="text-xs font-medium text-gray-400 mb-1.5 px-2 pb-1.5 border-b border-gray-800/60">Selecione o modelo:</div>
                      <div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent">
                        {MODEL_OPTIONS.slice(0, 6).map((modelOption) => {
                          // Extrair o nome curto do modelo para exibição
                          const displayName = modelOption.split('/').pop()?.replace(/-/g, ' ');
                          // Determinar o tipo de modelo para exibir um ícone ou cor diferente
                          const isVision = modelOption.includes('vision') || modelOption.includes('llama-4');
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
                                toast.success(`Modelo alterado para ${displayName}`);
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${isVision ? 'bg-blue-400' : isCoder ? 'bg-green-400' : 'bg-orange-400'} ${model === modelOption ? 'animate-pulse' : ''}`} 
                                  style={{ boxShadow: `0 0 5px ${isVision ? 'rgba(59,130,246,0.5)' : isCoder ? 'rgba(74,222,128,0.5)' : 'rgba(251,146,60,0.5)'}` }}
                                ></div>
                                <span className="text-xs truncate max-w-[130px] font-medium">{displayName}</span>
                              </div>
                              {model === modelOption && <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de microfone */}
              <MicrophoneButton
                onTranscription={handleTranscription}
                small={true}
              />

              {/* Botão de envio */}
              <Button
                className={`rounded-full transition-all duration-300 border text-xs active:scale-95 transform ${(mode === "query" ? query : currentFeedback).trim() ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30 hover:border-orange-500/50' : 'bg-black/20 text-gray-500 border-gray-800 hover:bg-black/40 hover:text-orange-300 hover:border-orange-400/30'}`}
                type="submit"
                disabled={isGenerating || !(mode === "query" ? query : currentFeedback).trim()}
              >
                <span className="flex items-center gap-1">
                  {isGenerating ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                  ) : (
                    <>{mode === "query" ? "Generate" : "Update"} <Sparkles className="h-[0.825rem] w-[0.825rem]" /></>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

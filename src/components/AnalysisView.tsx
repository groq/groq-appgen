import React, { useState } from 'react';
import { BarChart2, Eye, RefreshCw, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  title: string;
  description: string;
  score: number;
  recommendations: string[];
  category: 'performance' | 'accessibility' | 'bestPractices' | 'seo' | 'design';
}

interface AnalysisViewProps {
  results: AnalysisResult[];
  onRunAnalysis: () => void;
  onViewElement: (element: string) => void;
  onDownloadReport: () => void;
  onMaximize: () => void;
  isAnalyzing: boolean;
}

export function AnalysisView({
  results,
  onRunAnalysis,
  onViewElement,
  onDownloadReport,
  onMaximize,
  isAnalyzing
}: AnalysisViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filtrar resultados por categoria
  const filteredResults = selectedCategory
    ? results.filter(result => result.category === selectedCategory)
    : results;
  
  // Calcular pontuação média por categoria
  const calculateCategoryScore = (category: string) => {
    const categoryResults = results.filter(result => result.category === category);
    if (categoryResults.length === 0) return 0;
    
    const sum = categoryResults.reduce((acc, result) => acc + result.score, 0);
    return Math.round(sum / categoryResults.length);
  };
  
  // Obter cor com base na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Obter ícone com base na categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return '⚡';
      case 'accessibility':
        return '♿';
      case 'bestPractices':
        return '✅';
      case 'seo':
        return '🔍';
      case 'design':
        return '🎨';
      default:
        return '📊';
    }
  };
  
  return (
    <div className="analysis-view flex flex-col h-full">
      <div className="analysis-header flex items-center justify-between p-2 border-b border-orange-500/20 bg-black/80">
        <div className="flex items-center">
          <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          <span className="text-xs text-gray-300">Análise UX</span>
        </div>
        
        <div className="flex items-center space-x-1">
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
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            onClick={onDownloadReport}
            title="Baixar relatório"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            size="sm"
            className="h-7 px-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs"
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analisando...' : 'Analisar'}
          </Button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="flex items-center justify-center h-full bg-black/80 text-gray-300 text-sm">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-orange-300 font-medium mb-1">Analisando interface</span>
            <span className="text-xs text-gray-400">Isso pode levar alguns segundos...</span>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="flex items-center justify-center h-full bg-black/80 text-gray-400 text-sm">
          <div className="flex flex-col items-center">
            <BarChart2 className="h-8 w-8 mb-3 text-gray-500" />
            <span>Nenhuma análise realizada</span>
            <Button
              size="sm"
              className="mt-3 h-8 px-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs"
              onClick={onRunAnalysis}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Executar Análise
            </Button>
          </div>
        </div>
      ) : (
        <div className="analysis-content flex-1 overflow-y-auto">
          <div className="category-scores flex p-3 space-x-2 overflow-x-auto">
            <button
              className={`category-score-card flex-shrink-0 p-2 rounded-md border ${
                selectedCategory === null
                  ? 'border-orange-500/50 bg-orange-500/10'
                  : 'border-gray-700 bg-black/40 hover:bg-gray-800/40'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              <div className="text-xs font-medium text-gray-300 mb-1">Pontuação Geral</div>
              <div className={`text-lg font-bold ${getScoreColor(
                results.reduce((acc, result) => acc + result.score, 0) / results.length
              )}`}>
                {Math.round(results.reduce((acc, result) => acc + result.score, 0) / results.length)}
              </div>
            </button>
            
            {['performance', 'accessibility', 'bestPractices', 'seo', 'design'].map(category => (
              <button
                key={category}
                className={`category-score-card flex-shrink-0 p-2 rounded-md border ${
                  selectedCategory === category
                    ? 'border-orange-500/50 bg-orange-500/10'
                    : 'border-gray-700 bg-black/40 hover:bg-gray-800/40'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
              >
                <div className="flex items-center text-xs font-medium text-gray-300 mb-1">
                  <span className="mr-1">{getCategoryIcon(category)}</span>
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(calculateCategoryScore(category))}`}>
                  {calculateCategoryScore(category)}
                </div>
              </button>
            ))}
          </div>
          
          <div className="analysis-results p-3 space-y-3">
            {filteredResults.map((result, index) => (
              <div 
                key={index} 
                className="result-card border border-gray-700 rounded-md overflow-hidden bg-black/40"
              >
                <div className="result-header flex items-center justify-between p-2 border-b border-gray-800 bg-black/60">
                  <div className="flex items-center">
                    <span className="mr-1.5">{getCategoryIcon(result.category)}</span>
                    <span className="text-xs font-medium text-gray-300">{result.title}</span>
                  </div>
                  <div className={`text-sm font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                </div>
                
                <div className="result-content p-2">
                  <p className="text-xs text-gray-300 mb-2">{result.description}</p>
                  
                  {result.recommendations.length > 0 && (
                    <div className="recommendations">
                      <h4 className="text-xs font-medium text-orange-300 mb-1">Recomendações:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {result.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-xs text-gray-400">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      className="h-6 px-2 bg-black/60 hover:bg-gray-800/60 text-gray-300 border border-gray-700 text-xs"
                      onClick={() => onViewElement(result.title)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Elemento
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

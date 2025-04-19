"use client";

import React, { useState } from 'react';
import UXAnalyzer from '@/components/UXAnalyzer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UXAnalysisResult } from '@/utils/ux-analyzer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UXAnalyzerPage() {
  const [apiKey, setApiKey] = useState<string>('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');
  const [showAnalyzer, setShowAnalyzer] = useState<boolean>(false);
  const [analysisHistory, setAnalysisHistory] = useState<UXAnalysisResult[]>([]);

  const handleAnalysisComplete = (result: UXAnalysisResult) => {
    setAnalysisHistory(prev => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Analisador de UX do Nexus Gen</h1>
        
        {!showAnalyzer ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-100">Configuração</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chave da API Groq
                </label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Insira sua chave da API Groq"
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={() => setShowAnalyzer(true)}
                disabled={!apiKey}
                className="w-full"
              >
                Iniciar análise
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalyzer(false)}
              className="mb-4"
            >
              Voltar para configuração
            </Button>
            
            <UXAnalyzer 
              apiKey={apiKey} 
              onAnalysisComplete={handleAnalysisComplete} 
            />
            
            {analysisHistory.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Histórico de análises</h2>
                
                <div className="space-y-4">
                  {analysisHistory.map((analysis, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Análise #{analysisHistory.length - index}</h3>
                        <span className={`font-bold ${
                          analysis.score >= 80 ? 'text-green-500' : 
                          analysis.score >= 60 ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {analysis.score}/100
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {analysis.issues.length} problema(s) identificado(s)
                      </p>
                      
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="text-sm p-0 h-auto"
                          onClick={() => {
                            // Scroll para o topo e mostrar a análise atual
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setAnalysisHistory(prev => {
                              const newHistory = [...prev];
                              const item = newHistory.splice(index, 1)[0];
                              newHistory.unshift(item);
                              return newHistory;
                            });
                          }}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

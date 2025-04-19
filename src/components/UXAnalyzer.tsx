"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { analyzeScreenshot, fileToBase64, UXAnalysisResult, UXIssue } from '@/utils/ux-analyzer';
import { Camera, Upload, AlertTriangle, CheckCircle, Info, Crop, MousePointer, Monitor, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';

interface UXAnalyzerProps {
  apiKey: string;
  onAnalysisComplete?: (result: UXAnalysisResult) => void;
  onClose?: () => void;
}

type CaptureMode = 'fullscreen' | 'area' | 'element' | 'upload';

export default function UXAnalyzer({ apiKey, onAnalysisComplete, onClose }: UXAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UXAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<CaptureMode | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [userComment, setUserComment] = useState('');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{x: number, y: number} | null>(null);

  // Captura a tela atual
  const captureScreen = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Captura a tela usando html2canvas
      const canvas = await html2canvas(document.body);
      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      // Analisa a screenshot
      const result = await analyzeScreenshot(imageBase64, apiKey);

      setAnalysisResult(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(`Erro ao capturar tela: ${err}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analisa uma imagem enviada pelo usuário
  const analyzeUploadedImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const imageBase64 = await fileToBase64(file);
      const result = await analyzeScreenshot(imageBase64, apiKey);

      setAnalysisResult(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(`Erro ao analisar imagem: ${err}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Renderiza um problema de UX com ícone de severidade
  const renderIssue = (issue: UXIssue, index: number) => {
    const severityIcon = () => {
      switch (issue.severity) {
        case 'high':
          return <AlertTriangle className="h-5 w-5 text-red-500" />;
        case 'medium':
          return <Info className="h-5 w-5 text-yellow-500" />;
        case 'low':
          return <Info className="h-5 w-5 text-blue-500" />;
        default:
          return null;
      }
    };

    return (
      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-2">
        <div className="flex items-start gap-2">
          {severityIcon()}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Localização: {issue.location}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              <strong>Recomendação:</strong> {issue.recommendation}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Analisador de UX</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Button
          onClick={captureScreen}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Capturar tela
        </Button>

        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={analyzeUploadedImage}
            disabled={isAnalyzing}
            className="hidden"
            id="image-upload"
          />
          <Button
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isAnalyzing}
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Upload className="h-4 w-4" />
            Enviar imagem
          </Button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analisando interface...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Resultado da análise</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pontuação:</span>
              <span className={`font-bold ${
                analysisResult.score >= 80 ? 'text-green-500' :
                analysisResult.score >= 60 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {analysisResult.score}/100
              </span>
            </div>
          </div>

          {analysisResult.issues.length > 0 ? (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Problemas identificados:</h4>
              {analysisResult.issues.map((issue, index) => renderIssue(issue, index))}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md mb-6">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-700 dark:text-green-400">Nenhum problema identificado!</p>
            </div>
          )}

          {analysisResult.recommendations.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Recomendações gerais:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

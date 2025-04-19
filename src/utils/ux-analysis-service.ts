/**
 * Serviço para análise de UX
 */

import html2canvas from 'html2canvas';
import { analyzeImage } from './vision-service';

/**
 * Captura um screenshot de um elemento
 * @param element Elemento a ser capturado
 * @returns URL de dados da imagem
 */
export async function captureScreenshot(element: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
    throw error;
  }
}

/**
 * Interface para o resultado da análise UX
 */
export interface UXAnalysisResult {
  score: number;
  issues: Array<{
    type: string;
    description: string;
    severity?: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
}

/**
 * Interface para o relatório de análise UX
 */
export interface UXReport {
  screenshot: string;
  analysis: UXAnalysisResult;
  timestamp: Date;
}

/**
 * Analisa a UX de uma interface a partir de um screenshot
 * @param screenshot URL de dados da imagem
 * @returns Resultado da análise
 */
export async function analyzeUX(screenshot: string): Promise<UXAnalysisResult> {
  try {
    const prompt = `
      Analise esta interface de usuário e identifique problemas de usabilidade, acessibilidade, performance e design.
      Forneça uma pontuação de 0 a 100 para a interface como um todo.
      Identifique problemas específicos e forneça recomendações de melhoria.
      Retorne o resultado em formato JSON com os seguintes campos:
      {
        "score": number,
        "issues": [
          {
            "type": string,
            "description": string,
            "severity": "low" | "medium" | "high"
          }
        ],
        "recommendations": string[]
      }
    `;
    
    const response = await analyzeImage(screenshot, prompt, false);
    const content = response.choices[0].message.content;
    
    // Extrair o JSON da resposta
    let jsonStr = content;
    if (content.includes('```json')) {
      jsonStr = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonStr = content.split('```')[1].split('```')[0].trim();
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Erro ao analisar UX:', error);
    return {
      score: 0,
      issues: [
        {
          type: 'error',
          description: `Erro ao analisar UX: ${error instanceof Error ? error.message : String(error)}`,
          severity: 'high'
        }
      ],
      recommendations: ['Tente novamente mais tarde.']
    };
  }
}

/**
 * Gera um relatório de análise UX para um elemento
 * @param element Elemento a ser analisado
 * @returns Relatório de análise
 */
export async function generateUXReport(element: HTMLElement): Promise<UXReport> {
  const screenshot = await captureScreenshot(element);
  const analysis = await analyzeUX(screenshot);
  
  return {
    screenshot,
    analysis,
    timestamp: new Date()
  };
}

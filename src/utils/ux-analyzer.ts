/**
 * UX Analyzer - Ferramenta para análise de screenshots e identificação de problemas de interface
 * 
 * Este módulo fornece funções para analisar screenshots da interface do Nexus Gen
 * e identificar problemas comuns de UX, como:
 * - Elementos fora da tela ou cortados
 * - Problemas de alinhamento e centralização
 * - Elementos desproporcionais
 * - Problemas de contraste e legibilidade
 * - Inconsistências de design
 */

import { Groq } from "groq-sdk";

// Tipos para análise de UX
export interface UXAnalysisResult {
  issues: UXIssue[];
  score: number; // 0-100
  recommendations: string[];
}

export interface UXIssue {
  type: UXIssueType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  recommendation: string;
}

export type UXIssueType = 
  | 'overflow' // Elementos fora da tela ou cortados
  | 'alignment' // Problemas de alinhamento
  | 'proportion' // Elementos desproporcionais
  | 'contrast' // Problemas de contraste
  | 'consistency' // Inconsistências de design
  | 'spacing' // Problemas de espaçamento
  | 'readability' // Problemas de legibilidade
  | 'accessibility' // Problemas de acessibilidade
  | 'other'; // Outros problemas

/**
 * Analisa uma screenshot da interface usando a API Groq
 * @param imageBase64 Screenshot em formato base64
 * @param apiKey Chave da API Groq
 * @returns Resultado da análise de UX
 */
export async function analyzeScreenshot(
  imageBase64: string,
  apiKey: string
): Promise<UXAnalysisResult> {
  try {
    const groq = new Groq({ apiKey });
    
    const prompt = `
    Você é um especialista em UX/UI com foco em análise de interfaces. Analise esta screenshot da interface do Nexus Gen e identifique problemas de UX.
    
    Aspectos a serem analisados:
    1. Overflow: Há elementos cortados ou fora da tela?
    2. Alinhamento: Os elementos estão bem alinhados e centralizados?
    3. Proporção: Os elementos têm tamanho proporcional entre si?
    4. Contraste: Há problemas de contraste que afetam a legibilidade?
    5. Consistência: O design é consistente em toda a interface?
    6. Espaçamento: O espaçamento entre elementos é adequado?
    7. Legibilidade: Os textos são legíveis?
    8. Acessibilidade: A interface segue boas práticas de acessibilidade?
    
    Forneça uma análise detalhada no seguinte formato JSON:
    {
      "issues": [
        {
          "type": "overflow|alignment|proportion|contrast|consistency|spacing|readability|accessibility|other",
          "severity": "low|medium|high",
          "description": "Descrição detalhada do problema",
          "location": "Localização do problema na interface",
          "recommendation": "Recomendação para resolver o problema"
        }
      ],
      "score": 0-100,
      "recommendations": [
        "Recomendação geral 1",
        "Recomendação geral 2"
      ]
    }
    
    Responda APENAS com o JSON, sem texto adicional.
    `;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em UX/UI com foco em análise de interfaces."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      model: "llama3-70b-8192",
    });
    
    const responseContent = chatCompletion.choices[0]?.message?.content || '';
    
    try {
      // Extrair o JSON da resposta
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]) as UXAnalysisResult;
        return analysisResult;
      }
      
      throw new Error("Não foi possível extrair o JSON da resposta");
    } catch (parseError) {
      console.error("Erro ao analisar a resposta JSON:", parseError);
      return {
        issues: [
          {
            type: 'other',
            severity: 'high',
            description: 'Erro ao analisar a resposta da API',
            location: 'N/A',
            recommendation: 'Tente novamente ou verifique o formato da imagem'
          }
        ],
        score: 0,
        recommendations: ['Tente novamente com uma imagem diferente']
      };
    }
  } catch (error) {
    console.error("Erro ao analisar screenshot:", error);
    return {
      issues: [
        {
          type: 'other',
          severity: 'high',
          description: `Erro ao chamar a API: ${error}`,
          location: 'N/A',
          recommendation: 'Verifique sua conexão e chave da API'
        }
      ],
      score: 0,
      recommendations: ['Verifique sua conexão e chave da API']
    };
  }
}

/**
 * Converte uma imagem para base64
 * @param file Arquivo de imagem
 * @returns Promise com a string base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove o prefixo "data:image/jpeg;base64," para obter apenas o base64
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Web Search Service
 * 
 * Este módulo fornece funções para realizar pesquisas na web e extrair informações
 * relevantes para o processo de geração de código.
 */

import { Groq } from 'groq-sdk';

// Tipos para resultados de pesquisa
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface SearchResponse {
  results: SearchResult[];
  summary: string;
}

/**
 * Realiza uma pesquisa na web usando a API do Google
 * @param query Consulta de pesquisa
 * @returns Resultados da pesquisa
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Usar a API do Google Search para obter resultados
    // Nota: Em uma implementação real, você precisaria de uma chave de API do Google
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Google: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transformar os resultados no formato desejado
    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      source: 'Google'
    }));
  } catch (error) {
    console.error('Erro ao pesquisar na web:', error);
    return [];
  }
}

/**
 * Extrai informações relevantes de uma página web
 * @param url URL da página
 * @returns Conteúdo extraído
 */
export async function extractWebContent(url: string): Promise<string> {
  try {
    // Usar um serviço de extração de conteúdo
    // Nota: Em uma implementação real, você precisaria de um serviço como o Mercury Parser
    const response = await fetch(`https://mercury-parser-api.example.com/parser?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao extrair conteúdo: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Erro ao extrair conteúdo:', error);
    return '';
  }
}

/**
 * Analisa os resultados da pesquisa e gera um resumo
 * @param query Consulta original
 * @param results Resultados da pesquisa
 * @returns Resumo dos resultados
 */
export async function analyzeSearchResults(
  query: string,
  results: SearchResult[]
): Promise<string> {
  try {
    // Configurar cliente Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || '',
    });
    
    // Preparar o prompt para a análise
    const resultsText = results.map(r => 
      `Título: ${r.title}\nURL: ${r.url}\nTrecho: ${r.snippet}\n---`
    ).join('\n');
    
    const prompt = `
    Analise os seguintes resultados de pesquisa para a consulta "${query}":
    
    ${resultsText}
    
    Forneça um resumo conciso das informações mais relevantes encontradas nestes resultados.
    Foque em extrair conhecimento técnico, melhores práticas, e informações que seriam úteis
    para implementar um projeto relacionado a esta consulta.
    
    Seu resumo deve ser estruturado, informativo e direto ao ponto.
    `;
    
    // Enviar para o modelo
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1000,
    });
    
    return response.choices[0]?.message?.content || 'Não foi possível analisar os resultados.';
  } catch (error) {
    console.error('Erro ao analisar resultados:', error);
    return 'Erro ao analisar os resultados da pesquisa.';
  }
}

/**
 * Realiza uma pesquisa completa: busca, extração e análise
 * @param query Consulta de pesquisa
 * @returns Resposta completa da pesquisa
 */
export async function performCompleteSearch(query: string): Promise<SearchResponse> {
  // Realizar a pesquisa
  const results = await searchWeb(query);
  
  // Analisar os resultados
  const summary = await analyzeSearchResults(query, results);
  
  return {
    results,
    summary
  };
}

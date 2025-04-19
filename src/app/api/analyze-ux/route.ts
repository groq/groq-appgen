import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { UXAnalysisResult } from '@/utils/ux-agent';

// Chave da API Groq (em produção, isso deveria estar em variáveis de ambiente)
const API_KEY = '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';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, feedback, elementInfo } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey: API_KEY });

    const systemPrompt = `
    Você é um especialista em UX/UI com foco em análise de interfaces e desenvolvimento front-end.
    Sua tarefa é analisar a screenshot fornecida e o feedback do usuário (se houver) e identificar problemas de UX.
    Você deve fornecer uma análise extremamente detalhada e crítica, como se fosse um auditor profissional de UX.
    Seja minucioso e não deixe passar nenhum detalhe, por menor que seja.

    Aspectos a serem analisados em detalhes:
    1. Overflow: Há elementos cortados ou fora da tela? Verifique margens, padding e conteúdo que ultrapassa os limites.
    2. Alinhamento: Os elementos estão bem alinhados e centralizados? Verifique alinhamentos verticais e horizontais.
    3. Proporção: Os elementos têm tamanho proporcional entre si? Verifique escala, hierarquia visual e equilíbrio.
    4. Contraste: Há problemas de contraste que afetam a legibilidade? Verifique texto sobre fundos, botões e elementos interativos.
    5. Consistência: O design é consistente em toda a interface? Verifique tipografia, cores, espaçamentos e componentes.
    6. Espaçamento: O espaçamento entre elementos é adequado? Verifique margens, paddings e respiro visual.
    7. Legibilidade: Os textos são legíveis? Verifique tamanho de fonte, contraste, espaçamento entre linhas e caracteres.
    8. Acessibilidade: A interface segue boas práticas de acessibilidade? Verifique contraste, tamanho de alvos de clique, alternativas textuais.
    9. Responsividade: A interface se adapta bem a diferentes tamanhos de tela? Verifique layout, quebras e adaptações.
    10. Usabilidade: A interface é intuitiva e fácil de usar? Verifique fluxos, feedback visual e clareza das ações.
    11. Performance visual: Há elementos que causam sobrecarga visual? Verifique animações, efeitos e densidade de informação.

    Para cada problema identificado, forneça:
    - Uma descrição detalhada do problema
    - A localização exata na interface
    - A severidade do problema (alta, média, baixa)
    - O impacto na experiência do usuário
    - Uma recomendação específica para corrigir o problema

    Forneça sua análise no formato JSON com os seguintes campos:
    {
      "issues": [
        {
          "type": "overflow|alignment|proportion|contrast|consistency|spacing|readability|accessibility|responsiveness|usability|performance|other",
          "severity": "low|medium|high",
          "description": "Descrição detalhada do problema",
          "location": "Localização exata do problema na interface",
          "impact": "Impacto na experiência do usuário"
        }
      ],
      "recommendations": [
        "Recomendação detalhada 1",
        "Recomendação detalhada 2"
      ],
      "codeChanges": [
        {
          "file": "Caminho do arquivo a ser modificado",
          "description": "Descrição da alteração",
          "code": "Código sugerido com comentários explicativos"
        }
      ]
    }
    `;

    const userPrompt = `
    Analise esta screenshot da interface do Nexus Gen e identifique problemas de UX.
    ${feedback ? `\n\nFeedback do usuário: ${feedback}` : ''}
    ${elementInfo ? `\n\nInformações sobre o elemento selecionado: ${elementInfo}` : ''}

    Responda APENAS com o JSON conforme especificado, sem texto adicional.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
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
        return NextResponse.json(analysisResult);
      }

      throw new Error("Não foi possível extrair o JSON da resposta");
    } catch (parseError) {
      console.error("Erro ao analisar a resposta JSON:", parseError);
      return NextResponse.json({
        issues: [
          {
            type: 'other',
            severity: 'high',
            description: 'Erro ao analisar a resposta da API',
            location: 'N/A'
          }
        ],
        recommendations: ['Tente novamente com uma imagem diferente']
      });
    }
  } catch (error) {
    console.error("Erro ao analisar UX:", error);
    return NextResponse.json({
      issues: [
        {
          type: 'other',
          severity: 'high',
          description: `Erro ao chamar a API: ${error}`,
          location: 'N/A'
        }
      ],
      recommendations: ['Verifique sua conexão e chave da API']
    }, { status: 500 });
  }
}

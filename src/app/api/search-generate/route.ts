import { NextRequest, NextResponse } from 'next/server';
import { generateResponseWithSearch } from '@/utils/ai-service';
import { performCompleteSearch } from '@/utils/web-search';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Consulta não fornecida' },
        { status: 400 }
      );
    }

    // Realizar pesquisa na web
    const searchResponse = await performCompleteSearch(query);

    // Gerar resposta com base nos resultados da pesquisa
    const response = await generateResponseWithSearch(query, searchResponse.summary);

    return NextResponse.json({
      response,
      searchResults: searchResponse.results,
      searchSummary: searchResponse.summary
    });
  } catch (error) {
    console.error('Erro ao gerar resposta com pesquisa:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar resposta com pesquisa' },
      { status: 500 }
    );
  }
}

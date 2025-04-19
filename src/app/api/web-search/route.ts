import { NextRequest, NextResponse } from 'next/server';
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

    const searchResponse = await performCompleteSearch(query);

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Erro ao realizar pesquisa na web:', error);
    return NextResponse.json(
      { error: 'Falha ao realizar pesquisa na web' },
      { status: 500 }
    );
  }
}

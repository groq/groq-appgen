import { NextRequest, NextResponse } from 'next/server';
import { generateProjectPlan } from '@/utils/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { objectives, requirements, technologies } = await request.json();

    if (!objectives || !requirements || !technologies) {
      return NextResponse.json(
        { error: 'Dados do plano incompletos' },
        { status: 400 }
      );
    }

    // Gerar plano de projeto
    const plan = await generateProjectPlan(objectives, requirements, technologies);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Erro ao gerar plano de projeto:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar plano de projeto' },
      { status: 500 }
    );
  }
}

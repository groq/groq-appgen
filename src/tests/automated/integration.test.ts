/**
 * Testes automatizados para verificar a integração entre os componentes
 * 
 * Este arquivo contém testes que simulam o comportamento do usuário
 * e verificam se os componentes estão funcionando corretamente juntos.
 */

import { processAnnotatedImage, processElementFeedback } from '@/utils/visual-feedback-service';
import { generateCodeFromPlan } from '@/utils/plan-execution-service';
import { getAllTemplates, getTemplateById } from '@/utils/project-templates';

// Mock das funções que dependem de APIs externas
jest.mock('@/utils/agentic-service', () => ({
  generateAgenticResponse: jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: `
            <action type="file" filePath="src/components/Header.js">
            import React from 'react';
            
            function Header() {
              return (
                <header className="bg-gray-800 text-white p-4">
                  <h1 className="text-xl font-bold">Task Manager</h1>
                  <nav className="mt-2">
                    <ul className="flex space-x-4">
                      <li>Dashboard</li>
                      <li>Tasks</li>
                      <li>Profile</li>
                    </ul>
                  </nav>
                </header>
              );
            }
            
            export default Header;
            </action>
          `
        }
      }
    ]
  })
}));

jest.mock('@/utils/vision-service', () => ({
  analyzeImage: jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: `
            # Interpretação
            O usuário fez anotações na interface indicando que deseja aumentar o tamanho do cabeçalho e mudar a cor do texto para laranja.
            
            # Sugestões de Mudanças
            1. Aumentar a altura do cabeçalho de 80px para 100px
            2. Mudar a cor do texto do título para laranja (#FF5500)
            3. Aumentar o tamanho da fonte do título
            
            # Elementos Afetados
            - header: Aumentar altura e padding
            - h1: Mudar cor e tamanho da fonte
          `
        }
      }
    ]
  })
}));

jest.mock('@/utils/action-parser', () => ({
  parseActions: jest.fn().mockImplementation((content) => {
    if (content.includes('Header.js')) {
      return [
        {
          type: 'file',
          filePath: 'src/components/Header.js',
          content: `
            import React from 'react';
            
            function Header() {
              return (
                <header className="bg-gray-800 text-white p-4">
                  <h1 className="text-xl font-bold">Task Manager</h1>
                  <nav className="mt-2">
                    <ul className="flex space-x-4">
                      <li>Dashboard</li>
                      <li>Tasks</li>
                      <li>Profile</li>
                    </ul>
                  </nav>
                </header>
              );
            }
            
            export default Header;
          `
        }
      ];
    }
    return [];
  })
}));

describe('Integração entre componentes', () => {
  // Teste para processAnnotatedImage
  test('processAnnotatedImage deve retornar resultados corretos', async () => {
    const imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const notes = 'Aumentar o tamanho do cabeçalho';
    
    const result = await processAnnotatedImage(imageUrl, notes);
    
    expect(result).toBeDefined();
    expect(result.interpretation).toContain('Interpretação');
    expect(result.suggestedChanges.length).toBeGreaterThan(0);
    expect(result.files).toBeDefined();
    expect(result.files?.length).toBeGreaterThan(0);
  });
  
  // Teste para processElementFeedback
  test('processElementFeedback deve retornar resultados corretos', async () => {
    const elementPath = 'header > h1.title';
    const feedback = 'Mudar a cor para laranja';
    
    const result = await processElementFeedback(elementPath, feedback);
    
    expect(result).toBeDefined();
    expect(result.interpretation).toContain(elementPath);
    expect(result.interpretation).toContain(feedback);
    expect(result.suggestedChanges.length).toBeGreaterThan(0);
  });
  
  // Teste para generateCodeFromPlan
  test('generateCodeFromPlan deve gerar código a partir de um plano', async () => {
    const plan = {
      objectives: {
        title: 'Task Manager',
        description: 'Um aplicativo para gerenciar tarefas',
        targetAudience: 'Profissionais e equipes'
      },
      requirements: [
        {
          id: 'req-1',
          description: 'Autenticação de usuários',
          priority: 'Alta'
        },
        {
          id: 'req-2',
          description: 'CRUD de tarefas',
          priority: 'Alta'
        }
      ],
      technologies: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express'],
        database: ['MongoDB'],
        deployment: ['Vercel', 'MongoDB Atlas']
      },
      architecture: {
        components: ['Frontend (SPA)', 'Backend (API RESTful)', 'Banco de Dados'],
        dataFlow: 'Cliente <-> API <-> Banco de Dados'
      },
      implementation: [
        {
          id: 'imp-1',
          step: 'Configuração do Projeto',
          description: 'Inicializar repositórios e configurar ambiente',
          estimatedTime: '1h'
        },
        {
          id: 'imp-2',
          step: 'Implementação do Backend',
          description: 'Criar API e modelos de dados',
          estimatedTime: '3h'
        }
      ]
    };
    
    const result = await generateCodeFromPlan(plan);
    
    expect(result).toBeDefined();
    expect(result.steps.length).toBe(plan.implementation.length);
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.steps[0].status).toBe('complete');
  });
  
  // Teste para templates de projetos
  test('getAllTemplates deve retornar todos os templates', () => {
    const templates = getAllTemplates();
    
    expect(templates).toBeDefined();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0].id).toBeDefined();
    expect(templates[0].name).toBeDefined();
    expect(templates[0].files.length).toBeGreaterThan(0);
  });
  
  test('getTemplateById deve retornar um template específico', () => {
    const templateId = 'react-basic';
    const template = getTemplateById(templateId);
    
    expect(template).toBeDefined();
    expect(template?.id).toBe(templateId);
    expect(template?.files.length).toBeGreaterThan(0);
  });
});

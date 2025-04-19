/**
 * Testes para a Visualização de Progresso
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressCards } from '@/components/ProgressCards';

describe('ProgressCards', () => {
  test('should render progress cards correctly', () => {
    const steps = [
      { title: 'Step 1', status: 'complete', description: 'Step 1 description' },
      { title: 'Step 2', status: 'running', description: 'Step 2 description' },
      { title: 'Step 3', status: 'pending' }
    ];
    
    render(<ProgressCards steps={steps} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    
    expect(screen.getByText('Step 1 description')).toBeInTheDocument();
    expect(screen.getByText('Step 2 description')).toBeInTheDocument();
  });
  
  test('should display correct status indicators', () => {
    const steps = [
      { title: 'Complete Step', status: 'complete' },
      { title: 'Running Step', status: 'running' },
      { title: 'Pending Step', status: 'pending' },
      { title: 'Failed Step', status: 'failed', error: 'Error message' }
    ];
    
    const { container } = render(<ProgressCards steps={steps} />);
    
    // Verificar se os ícones de status estão presentes
    // Nota: Isso é uma verificação simplificada, em um teste real você pode querer verificar classes específicas ou atributos
    expect(container.querySelector('.text-green-500')).toBeInTheDocument(); // Complete
    expect(container.querySelector('.animate-spin')).toBeInTheDocument(); // Running
    expect(container.querySelector('.text-gray-400')).toBeInTheDocument(); // Pending
    expect(container.querySelector('.text-red-500')).toBeInTheDocument(); // Failed
    
    // Verificar se a mensagem de erro está presente
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
  
  test('should handle empty steps array', () => {
    render(<ProgressCards steps={[]} />);
    
    // Verificar se o componente não quebra com um array vazio
    expect(screen.queryByText('Step')).not.toBeInTheDocument();
  });
});

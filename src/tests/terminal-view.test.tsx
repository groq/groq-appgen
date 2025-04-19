/**
 * Testes para a Integração com Terminal
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerminalView } from '@/components/TerminalView';
import { TerminalCommand } from '@/types/file-types';

describe('TerminalView', () => {
  test('should render terminal commands correctly', () => {
    const commands: TerminalCommand[] = [
      {
        input: 'npm init -y',
        output: 'Wrote to package.json',
        timestamp: new Date()
      },
      {
        input: 'npm install react',
        output: 'added 1 package, and audited 2 packages in 1s',
        timestamp: new Date()
      }
    ];
    
    render(
      <TerminalView
        commands={commands}
        onCommandSubmit={jest.fn()}
        onClear={jest.fn()}
        onMaximize={jest.fn()}
      />
    );
    
    expect(screen.getByText('npm init -y')).toBeInTheDocument();
    expect(screen.getByText('Wrote to package.json')).toBeInTheDocument();
    expect(screen.getByText('npm install react')).toBeInTheDocument();
    expect(screen.getByText('added 1 package, and audited 2 packages in 1s')).toBeInTheDocument();
  });
  
  test('should handle command submission correctly', () => {
    const onCommandSubmit = jest.fn();
    
    render(
      <TerminalView
        commands={[]}
        onCommandSubmit={onCommandSubmit}
        onClear={jest.fn()}
        onMaximize={jest.fn()}
      />
    );
    
    // Encontrar o input
    const input = screen.getByRole('textbox');
    
    // Digitar um comando
    fireEvent.change(input, { target: { value: 'npm install react' } });
    
    // Submeter o formulário
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Verificar se a função onCommandSubmit foi chamada com o comando correto
    expect(onCommandSubmit).toHaveBeenCalledWith('npm install react');
  });
  
  test('should handle clear button correctly', () => {
    const onClear = jest.fn();
    
    render(
      <TerminalView
        commands={[
          {
            input: 'npm init -y',
            output: 'Wrote to package.json',
            timestamp: new Date()
          }
        ]}
        onCommandSubmit={jest.fn()}
        onClear={onClear}
        onMaximize={jest.fn()}
      />
    );
    
    // Encontrar o botão de limpar
    const clearButton = screen.getByTitle('Limpar terminal');
    
    // Clicar no botão
    fireEvent.click(clearButton);
    
    // Verificar se a função onClear foi chamada
    expect(onClear).toHaveBeenCalled();
  });
  
  test('should handle maximize button correctly', () => {
    const onMaximize = jest.fn();
    
    render(
      <TerminalView
        commands={[]}
        onCommandSubmit={jest.fn()}
        onClear={jest.fn()}
        onMaximize={onMaximize}
      />
    );
    
    // Encontrar o botão de maximizar
    const maximizeButton = screen.getByTitle('Maximizar');
    
    // Clicar no botão
    fireEvent.click(maximizeButton);
    
    // Verificar se a função onMaximize foi chamada
    expect(onMaximize).toHaveBeenCalled();
  });
  
  test('should disable input when executing command', () => {
    render(
      <TerminalView
        commands={[]}
        onCommandSubmit={jest.fn()}
        onClear={jest.fn()}
        onMaximize={jest.fn()}
        isExecuting={true}
      />
    );
    
    // Verificar se a mensagem de execução está presente
    expect(screen.getByText('Executando comando...')).toBeInTheDocument();
  });
});

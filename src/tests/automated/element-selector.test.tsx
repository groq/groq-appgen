/**
 * Testes para o componente ElementSelector
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ElementSelectorNew as ElementSelector } from '@/components/ElementSelectorNew';

// Mock das funções de callback
const mockOnClose = jest.fn();
const mockOnSendFeedback = jest.fn();

// Mock do document.addEventListener
const originalAddEventListener = document.addEventListener;
const originalRemoveEventListener = document.removeEventListener;

describe('ElementSelector', () => {
  beforeAll(() => {
    // Mock do document.addEventListener
    document.addEventListener = jest.fn((event, handler, options) => {
      return originalAddEventListener.call(document, event, handler, options);
    });
    
    document.removeEventListener = jest.fn((event, handler, options) => {
      return originalRemoveEventListener.call(document, event, handler, options);
    });
  });
  
  afterAll(() => {
    // Restaurar o document.addEventListener original
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });
  
  beforeEach(() => {
    // Limpar os mocks antes de cada teste
    mockOnClose.mockClear();
    mockOnSendFeedback.mockClear();
    (document.addEventListener as jest.Mock).mockClear();
    (document.removeEventListener as jest.Mock).mockClear();
  });
  
  test('deve renderizar corretamente no modo de seleção', () => {
    render(
      <ElementSelector
        onClose={mockOnClose}
        onSendFeedback={mockOnSendFeedback}
      />
    );
    
    // Verificar se o texto de instrução está presente
    expect(screen.getByText(/Selecione um elemento na página/i)).toBeInTheDocument();
    
    // Verificar se o botão de fechar está presente
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    
    // Verificar se os event listeners foram adicionados
    expect(document.addEventListener).toHaveBeenCalledWith('mouseover', expect.any(Function), true);
    expect(document.addEventListener).toHaveBeenCalledWith('mouseout', expect.any(Function), true);
    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
  });
  
  test('deve chamar onClose quando o botão de fechar é clicado', () => {
    render(
      <ElementSelector
        onClose={mockOnClose}
        onSendFeedback={mockOnSendFeedback}
      />
    );
    
    // Clicar no botão de fechar
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Verificar se onClose foi chamado
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('deve remover os event listeners quando o componente é desmontado', () => {
    const { unmount } = render(
      <ElementSelector
        onClose={mockOnClose}
        onSendFeedback={mockOnSendFeedback}
      />
    );
    
    // Desmontar o componente
    unmount();
    
    // Verificar se os event listeners foram removidos
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseover', expect.any(Function), true);
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseout', expect.any(Function), true);
    expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
  });
});

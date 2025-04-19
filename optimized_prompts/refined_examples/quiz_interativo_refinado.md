# Prompt Refinado: Quiz Interativo

```
Crie um quiz interativo com as seguintes especificações:

1. Funcionalidade (essencial):
   - Apresentar perguntas de múltipla escolha com 4 opções de resposta
   - Exibir feedback imediato após cada resposta (correto/incorreto)
   - Calcular e mostrar pontuação final ao término do quiz
   - Temporizador para cada pergunta (15 segundos) com barra de progresso visual
   - Permitir reiniciar o quiz ao final
   - Exibir progresso atual (pergunta X de Y)
   - Mostrar explicação da resposta correta após cada questão

2. Design (essencial):
   - Interface colorida e divertida com tema de conhecimentos gerais
   - Esquema de cores: fundo roxo claro (#f3e5f5), elementos em roxo escuro (#7b1fa2), verde (#4caf50) para respostas corretas, vermelho (#f44336) para incorretas
   - Layout centralizado com cards para perguntas (máx. 800px de largura)
   - Animações para transições entre perguntas (fade ou slide)
   - Design responsivo para desktop e mobile (texto maior em mobile)
   - Inspirado em aplicativos como Kahoot/Quizizz

3. Dados (essencial):
   - Banco de pelo menos 5 perguntas de conhecimentos gerais:
     ```javascript
     const questions = [
       {
         question: "Qual é a capital do Brasil?",
         options: ["Rio de Janeiro", "São Paulo", "Brasília", "Belo Horizonte"],
         correct: 2,
         explanation: "Brasília é a capital do Brasil desde 1960."
       },
       {
         question: "Qual é o maior planeta do nosso sistema solar?",
         options: ["Terra", "Saturno", "Júpiter", "Urano"],
         correct: 2,
         explanation: "Júpiter é o maior planeta do nosso sistema solar."
       }
       // Adicione pelo menos mais 3 perguntas
     ];
     ```
   - Armazenamento de pontuações máximas usando localStorage
   - Categorias: História, Ciência, Geografia, Entretenimento, Esportes

4. Interação (importante):
   - Feedback visual e sonoro para respostas (som diferente para correto/incorreto)
   - Destaque da opção correta após resposta (mesmo se o usuário errar)
   - Barra de progresso para o temporizador que muda de cor nos últimos 5 segundos
   - Botões grandes e acessíveis para seleção de respostas (min. 44px de altura)
   - Transições suaves entre perguntas (300ms)
   - Suporte para navegação por teclado (teclas 1-4 para opções)

5. Recursos adicionais (desejável):
   - Sistema de recordes (top 5 pontuações) usando localStorage
   - Modo de revisão para ver todas as perguntas e respostas corretas
   - Opção para silenciar efeitos sonoros
   - Compartilhamento de resultados (simulado com geração de texto)
   - Confetes/animação para pontuação perfeita

6. Bibliotecas e recursos:
   - Usar Tailwind CSS para estilos (via CDN: https://cdn.tailwindcss.com)
   - Sons de https://freesound.org ou similar
   - Considerar usar anime.js para animações mais elaboradas (https://animejs.com/)
```

## Notas sobre o Refinamento

Este prompt foi refinado com base na análise dos testes anteriores, incorporando as seguintes melhorias:

1. **Priorização clara**: Recursos marcados como essenciais, importantes ou desejáveis
2. **Exemplos concretos**: Incluído exemplo JavaScript da estrutura de dados com 2 perguntas
3. **Especificações de acessibilidade**: Tamanho mínimo de botões, suporte a teclado
4. **Interações detalhadas**: Descrições específicas de feedback e animações
5. **Recursos de áudio**: Especificações para feedback sonoro com fonte sugerida
6. **Dimensões específicas**: Largura máxima de cards, duração de animações

Este prompt refinado deve produzir um quiz interativo mais envolvente e acessível, com foco na experiência do usuário e feedback claro.

# Prompt Refinado: Conversor Universal de Unidades

```
Crie um conversor universal de unidades com as seguintes especificações:

1. Funcionalidade (essencial):
   - Conversão entre múltiplas categorias: comprimento, área, volume, massa, temperatura
   - Suporte a unidades métricas e imperiais mais comuns (pelo menos 5 unidades por categoria)
   - Conversão instantânea ao digitar valores (sem necessidade de botão "converter")
   - Precisão decimal ajustável (2-6 casas decimais)
   - Histórico das 10 conversões mais recentes

2. Design (essencial):
   - Interface limpa e funcional com espaço em branco adequado
   - Esquema de cores: azul principal (#2196f3), azul escuro para cabeçalho (#0d47a1), branco para fundo (#ffffff), cinza claro para elementos secundários (#f5f5f5)
   - Layout com seleção de categoria no topo, unidades de origem e destino lado a lado em desktop, empilhadas em mobile
   - Design responsivo com breakpoints em 768px e 1024px
   - Inspirado no Google Material Design

3. Dados (essencial):
   - Estrutura de dados para unidades:
     ```json
     {
       "comprimento": [
         {"nome": "Metro", "simbolo": "m", "fator": 1},
         {"nome": "Quilômetro", "simbolo": "km", "fator": 1000},
         {"nome": "Centímetro", "simbolo": "cm", "fator": 0.01}
       ]
     }
     ```
   - Armazenamento de histórico e configurações usando localStorage
   - Fórmulas de conversão precisas para casos especiais (temperatura)
   - Dados pré-carregados para todas as unidades suportadas

4. Interação (importante):
   - Seleção de categoria com tabs ou dropdown
   - Atualização em tempo real dos valores convertidos ao digitar
   - Botão de inversão para trocar unidades de origem e destino com animação suave
   - Cópia de resultados com um clique e feedback visual (tooltip "Copiado!")
   - Validação de entrada para aceitar apenas números válidos

5. Recursos adicionais (desejável):
   - Tema claro/escuro com toggle no cabeçalho (usando prefers-color-scheme como padrão)
   - Favoritar conversões frequentes (máximo 5)
   - Modo offline completo usando cache
   - Seletor de precisão decimal (slider ou dropdown)
   - Exibição de fórmula de conversão usada

6. Bibliotecas e recursos:
   - Usar Tailwind CSS para estilos (via CDN: https://cdn.tailwindcss.com)
   - Considerar usar Decimal.js para cálculos precisos (https://mikemcl.github.io/decimal.js/)
   - Ícones do Google Material Icons ou Font Awesome
```

## Notas sobre o Refinamento

Este prompt foi refinado com base na análise dos testes anteriores, incorporando as seguintes melhorias:

1. **Priorização clara**: Recursos marcados como essenciais, importantes ou desejáveis
2. **Limitação de escopo**: Reduzido para 5 categorias principais para melhor implementação
3. **Exemplos concretos**: Incluído exemplo JSON da estrutura de dados
4. **Especificações visuais detalhadas**: Códigos de cores específicos e breakpoints
5. **Bibliotecas sugeridas**: Recomendações específicas para cálculos precisos
6. **Interações detalhadas**: Descrição clara de comportamentos esperados (ex: feedback de cópia)

Este prompt refinado deve produzir um conversor de unidades mais completo e funcional, com foco nas funcionalidades essenciais e uma implementação de alta qualidade.

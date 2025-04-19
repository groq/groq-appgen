# Estrutura Base para Prompts Otimizados

Com base na análise dos prompts bem-sucedidos, desenvolvemos a seguinte estrutura base para criar prompts otimizados para o Groq-AppGen:

## Estrutura de Prompt Otimizado

```
Crie uma [tipo de aplicação] com as seguintes especificações:

1. Funcionalidade:
   - [Funcionalidade principal]
   - [Operações específicas, se aplicável (CRUD)]
   - [Comportamentos esperados]

2. Design:
   - [Estilo visual (minimalista, colorido, corporativo, etc.)]
   - [Esquema de cores]
   - [Layout e organização]
   - [Responsividade e adaptação]

3. Dados:
   - [Estrutura de dados]
   - [Armazenamento (localStorage, sessionStorage)]
   - [Integração com APIs, se aplicável]

4. Interação:
   - [Comportamento de elementos interativos]
   - [Feedback ao usuário]
   - [Validações e tratamento de erros]

5. Recursos adicionais (opcional):
   - [Funcionalidades extras]
   - [Melhorias de UX]
```

## Elementos-Chave para Todos os Prompts

1. **Tipo de Aplicação Claro**
   - Especificar claramente o tipo de aplicação logo no início do prompt
   - Exemplo: "Crie uma calculadora", "Crie um gerenciador de tarefas"

2. **Lista de Funcionalidades Específicas**
   - Listar todas as funcionalidades principais que a aplicação deve ter
   - Ser específico sobre operações CRUD quando aplicável
   - Exemplo: "adicionar, editar, excluir e marcar tarefas como concluídas"

3. **Especificações de Design**
   - Incluir preferências de design, mesmo que básicas
   - Mencionar esquema de cores, layout ou referências visuais
   - Exemplo: "design minimalista com cores neutras" ou "inspirado no Material Design"

4. **Tecnologias e Métodos de Armazenamento**
   - Especificar tecnologias específicas quando relevante
   - Mencionar métodos de armazenamento quando aplicável
   - Exemplo: "usando localStorage para persistência de dados"

5. **Estrutura Organizada**
   - Usar listas numeradas ou com marcadores para organizar o prompt
   - Separar diferentes aspectos da aplicação em seções distintas
   - Exemplo: separar funcionalidades, design, dados e interação

## Adaptações por Categoria

### Para Ferramentas e Utilitários Simples
- Foco na funcionalidade principal
- Especificar operações básicas
- Mencionar interface intuitiva

### Para Aplicações CRUD
- Detalhar todas as operações CRUD
- Especificar estrutura de dados
- Mencionar persistência de dados

### Para Dashboards e Visualização de Dados
- Especificar tipos de gráficos/visualizações
- Detalhar fontes de dados
- Mencionar interatividade dos elementos visuais

### Para Jogos e Aplicações Interativas
- Detalhar regras e mecânicas
- Especificar feedback ao usuário
- Mencionar sistema de pontuação/progresso

### Para Integrações com APIs
- Especificar a API a ser utilizada
- Detalhar dados a serem exibidos
- Mencionar tratamento de erros e estados de carregamento

### Para Interfaces de Autenticação
- Detalhar campos e validações
- Especificar fluxo de autenticação
- Mencionar feedback de erros

### Para Ferramentas de Produtividade
- Detalhar organização de dados
- Especificar funcionalidades de filtro/busca
- Mencionar estatísticas e visualizações

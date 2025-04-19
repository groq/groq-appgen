# Prompt Otimizado: Aplicação CRUD

## Gerenciador de Contatos

```
Crie um gerenciador de contatos completo com as seguintes especificações:

1. Funcionalidade:
   - Adicionar novos contatos com campos para nome, sobrenome, email, telefone, empresa e notas
   - Visualizar lista de contatos com opções de ordenação por nome, sobrenome ou empresa
   - Editar informações de contatos existentes
   - Excluir contatos com confirmação
   - Marcar contatos como favoritos
   - Pesquisar contatos por nome, email ou empresa

2. Design:
   - Interface limpa e profissional com tema claro/escuro
   - Cores principais: azul (#3498db) para elementos de ação, cinza (#f5f5f5) para fundo
   - Layout responsivo que funcione bem em desktop e mobile
   - Lista de contatos à esquerda, detalhes do contato selecionado à direita
   - Ícones para ações comuns (adicionar, editar, excluir, favorito)

3. Dados:
   - Estrutura de dados JSON para armazenar contatos
   - Persistência usando localStorage
   - Exportação/importação de contatos em formato JSON
   - Dados de exemplo pré-carregados (5-10 contatos)

4. Interação:
   - Formulário de adição/edição com validação de campos (email válido, telefone no formato correto)
   - Feedback visual para ações (mensagens de sucesso/erro)
   - Confirmação antes de excluir contatos
   - Animações suaves para transições entre visualizações

5. Recursos adicionais:
   - Agrupamento de contatos por letra inicial ou empresa
   - Contador mostrando número total de contatos
   - Estatísticas simples (contatos por empresa, favoritos)
   - Modo de visualização em lista ou grade
```

## Gerenciador de Tarefas

```
Crie um gerenciador de tarefas completo com as seguintes especificações:

1. Funcionalidade:
   - Adicionar tarefas com título, descrição, data de vencimento, prioridade e categoria
   - Visualizar tarefas em diferentes visualizações (lista, kanban)
   - Editar detalhes de tarefas existentes
   - Marcar tarefas como concluídas
   - Excluir tarefas com confirmação
   - Filtrar tarefas por status, prioridade e categoria
   - Ordenar tarefas por data, prioridade ou título

2. Design:
   - Interface moderna com tema escuro e acentos em azul (#3498db)
   - Layout responsivo com sidebar para navegação
   - Cores para prioridades: alta (vermelho), média (amarelo), baixa (verde)
   - Ícones intuitivos para ações e status
   - Design inspirado no Trello/Asana

3. Dados:
   - Estrutura de dados JSON para armazenar tarefas
   - Persistência usando localStorage
   - Categorias pré-definidas (Trabalho, Pessoal, Compras, Saúde)
   - Backup/restauração de dados

4. Interação:
   - Drag-and-drop para mover tarefas entre status (na visualização kanban)
   - Notificações visuais para tarefas próximas do vencimento
   - Validação de formulários com feedback imediato
   - Confirmação antes de excluir tarefas
   - Atalhos de teclado para ações comuns

5. Recursos adicionais:
   - Estatísticas de produtividade (tarefas concluídas por dia/semana)
   - Gráfico de distribuição de tarefas por categoria
   - Modo pomodoro integrado para trabalhar em tarefas
   - Tema claro/escuro alternável
```

## Sistema de Gerenciamento de Inventário

```
Crie um sistema de gerenciamento de inventário com as seguintes especificações:

1. Funcionalidade:
   - Adicionar itens com nome, descrição, categoria, quantidade, preço unitário e fornecedor
   - Visualizar lista de itens com opções de ordenação e filtragem
   - Editar informações de itens existentes
   - Excluir itens com confirmação
   - Registrar entrada e saída de itens (ajuste de estoque)
   - Pesquisar itens por nome, categoria ou fornecedor
   - Alertas para itens com estoque baixo

2. Design:
   - Interface profissional e funcional com tema claro
   - Cores: azul (#2c3e50) para cabeçalhos, branco para fundo, verde (#27ae60) para ações positivas, vermelho (#e74c3c) para ações negativas
   - Layout em tabela para visualização de itens
   - Painéis de resumo no topo com estatísticas importantes
   - Design responsivo adaptável a diferentes tamanhos de tela

3. Dados:
   - Estrutura de dados JSON para armazenar itens e transações
   - Persistência usando localStorage
   - Categorias e fornecedores pré-definidos
   - Histórico de transações (entradas/saídas)

4. Interação:
   - Formulários modais para adicionar/editar itens
   - Validação de campos com feedback visual
   - Confirmação para ações irreversíveis
   - Filtros avançados com múltiplos critérios
   - Paginação para grandes conjuntos de dados

5. Recursos adicionais:
   - Dashboard com gráficos (valor total do inventário, itens por categoria)
   - Exportação de dados para CSV
   - Relatório de itens com baixo estoque
   - Histórico de alterações por item
   - Cálculo automático de valor total do inventário
```

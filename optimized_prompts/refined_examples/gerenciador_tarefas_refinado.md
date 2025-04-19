# Prompt Refinado: Gerenciador de Tarefas

```
Crie um gerenciador de tarefas completo com as seguintes especificações:

1. Funcionalidade (essencial):
   - Adicionar tarefas com título (obrigatório), descrição (opcional), data de vencimento (opcional), prioridade (alta/média/baixa) e categoria
   - Visualizar tarefas em lista com opção de alternar para visualização kanban (3 colunas: A fazer, Em andamento, Concluído)
   - Editar detalhes de tarefas existentes através de modal ou painel lateral
   - Marcar tarefas como concluídas com checkbox e efeito visual (texto riscado)
   - Excluir tarefas com confirmação para evitar exclusões acidentais
   - Filtrar tarefas por status, prioridade e categoria (múltiplos filtros simultâneos)
   - Ordenar tarefas por data, prioridade ou título (ascendente/descendente)

2. Design (essencial):
   - Interface moderna com tema escuro por padrão
   - Esquema de cores: fundo escuro (#121212), elementos de interface (#1e1e1e), acentos em azul (#3498db), texto claro (#e0e0e0)
   - Cores para prioridades: alta (#e74c3c), média (#f39c12), baixa (#2ecc71)
   - Layout responsivo com sidebar para navegação (colapsável em mobile)
   - Ícones para ações e status: adicionar (+), editar (lápis), excluir (lixeira), concluído (check)
   - Design inspirado no Trello/Asana com cards para tarefas
   - Espaçamento consistente: 16px entre elementos, 24px entre seções

3. Dados (essencial):
   - Estrutura de dados JSON para tarefas:
     ```json
     {
       "id": "task-123",
       "title": "Completar relatório",
       "description": "Finalizar relatório mensal de vendas",
       "dueDate": "2023-06-15",
       "priority": "alta",
       "category": "trabalho",
       "status": "em-andamento",
       "createdAt": "2023-06-01T10:30:00Z",
       "completed": false
     }
     ```
   - Persistência usando localStorage com chave "tasks"
   - Categorias pré-definidas: Trabalho, Pessoal, Compras, Saúde (com opção de adicionar personalizadas)
   - Backup/restauração de dados com exportação/importação JSON

4. Interação (importante):
   - Formulários com validação em tempo real (título não pode estar vazio)
   - Notificações visuais para tarefas próximas do vencimento (amarelo para hoje, vermelho para atrasadas)
   - Confirmação antes de excluir tarefas ("Tem certeza que deseja excluir esta tarefa?")
   - Feedback visual para ações (toast notifications para criar/editar/excluir)
   - Animações suaves para adição/remoção de tarefas (300ms)
   - Atalhos de teclado: N (nova tarefa), E (editar selecionada), Delete (excluir selecionada)

5. Recursos adicionais (desejável, em ordem de prioridade):
   - Tema claro/escuro alternável com botão no cabeçalho
   - Estatísticas simples: total de tarefas, concluídas, pendentes, atrasadas
   - Pesquisa de tarefas por texto (título e descrição)
   - Modo de foco que destaca apenas a tarefa selecionada
   - Persistência do estado da interface (filtros aplicados, ordenação)

6. Bibliotecas e recursos:
   - Usar Tailwind CSS para estilos (via CDN: https://cdn.tailwindcss.com)
   - Font Awesome para ícones (via CDN)
   - date-fns para manipulação de datas (https://date-fns.org/)
   - UUID para geração de IDs únicos
```

## Notas sobre o Refinamento

Este prompt foi refinado com base na análise dos testes anteriores, incorporando as seguintes melhorias:

1. **Priorização clara**: Recursos marcados como essenciais, importantes ou desejáveis (em ordem)
2. **Exemplos concretos**: Incluído exemplo JSON da estrutura de dados completa
3. **Especificações visuais detalhadas**: Códigos de cores específicos, espaçamentos, ícones
4. **Interações detalhadas**: Mensagens de confirmação, feedback visual, atalhos de teclado
5. **Validação de dados**: Requisitos específicos para campos (título obrigatório)
6. **Bibliotecas específicas**: Recomendações para manipulação de datas e geração de IDs

Este prompt refinado deve produzir um gerenciador de tarefas mais completo e funcional, com foco na experiência do usuário e na organização eficiente das tarefas.

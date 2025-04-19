# Prompt Otimizado: Interfaces de Autenticação

## Sistema de Login Completo

```
Crie um sistema de login completo com as seguintes especificações:

1. Funcionalidade:
   - Página de login com campos para email/usuário e senha
   - Página de registro com validação de campos
   - Funcionalidade de "Esqueci minha senha"
   - Autenticação simulada (sem backend real)
   - Verificação de força de senha durante registro
   - Login persistente usando localStorage
   - Página de perfil de usuário após login
   - Logout com confirmação

2. Design:
   - Interface moderna e profissional
   - Esquema de cores: azul (#1976d2) para elementos principais, branco para fundo, cinza para detalhes
   - Layout centralizado para formulários de autenticação
   - Transições suaves entre páginas
   - Design responsivo para todos os dispositivos
   - Inspirado em sistemas de autenticação modernos como Google/Microsoft

3. Dados:
   - Armazenamento de usuários simulado em localStorage
   - Estrutura de dados para usuários com campos para nome, email, senha (hash simulado), data de registro
   - Tokens JWT simulados para autenticação
   - Histórico de logins

4. Interação:
   - Validação em tempo real de campos de formulário
   - Feedback visual para erros de validação
   - Indicador de força de senha
   - Mostrar/ocultar senha
   - Redirecionamentos automáticos baseados no estado de autenticação

5. Recursos adicionais:
   - Autenticação de dois fatores simulada
   - Opções de "Lembrar-me" para login persistente
   - Bloqueio temporário após múltiplas tentativas falhas
   - Temas claro/escuro
   - Opções de login social simuladas (Google, Facebook)
```

## Página de Registro Multi-etapas

```
Crie uma página de registro multi-etapas com as seguintes especificações:

1. Funcionalidade:
   - Processo de registro dividido em 4 etapas: Informações básicas, Detalhes pessoais, Preferências, Confirmação
   - Validação de campos em cada etapa antes de prosseguir
   - Capacidade de voltar a etapas anteriores sem perder dados
   - Barra de progresso mostrando avanço no processo
   - Resumo final antes da confirmação
   - Verificação de email simulada
   - Termos e condições com confirmação obrigatória

2. Design:
   - Interface limpa e amigável
   - Esquema de cores: verde (#4caf50) para elementos de progresso, branco para fundo, cinza para texto secundário
   - Layout centralizado com cards para cada etapa
   - Indicadores visuais claros da etapa atual
   - Design responsivo com ajustes para mobile
   - Inspirado em processos de onboarding modernos

3. Dados:
   - Armazenamento temporário de dados entre etapas
   - Validação específica para diferentes tipos de campos (email, telefone, senha)
   - Persistência de dados parciais em caso de recarga da página
   - Simulação de envio final dos dados

4. Interação:
   - Transições animadas entre etapas
   - Validação em tempo real com feedback visual
   - Botões claros para navegação (Anterior, Próximo, Enviar)
   - Tooltips explicativos para campos complexos
   - Confirmação antes de abandonar o processo com dados não salvos

5. Recursos adicionais:
   - Estimativa de tempo para conclusão
   - Opção para salvar e continuar mais tarde
   - Sugestões automáticas para campos comuns
   - Verificação de força de senha com recomendações
   - Modo de acessibilidade para usuários com necessidades especiais
```

## Painel de Controle de Conta de Usuário

```
Crie um painel de controle de conta de usuário com as seguintes especificações:

1. Funcionalidade:
   - Visualização e edição de informações de perfil
   - Alteração de senha com verificação de segurança
   - Gerenciamento de preferências de notificação
   - Configurações de privacidade
   - Histórico de atividades da conta
   - Opções de segurança (autenticação de dois fatores simulada)
   - Gerenciamento de dispositivos conectados
   - Opção para excluir conta

2. Design:
   - Interface organizada e intuitiva
   - Esquema de cores: azul (#2196f3) para elementos principais, cinza claro (#f5f5f5) para fundo, laranja (#ff9800) para alertas
   - Layout com menu lateral para navegação entre seções
   - Cards para diferentes grupos de configurações
   - Design responsivo com menu colapsável em mobile
   - Inspirado em painéis de controle como Google Account/AWS Console

3. Dados:
   - Dados de usuário simulados armazenados em localStorage
   - Histórico de atividades fictício
   - Lista de dispositivos conectados simulada
   - Preferências de usuário persistentes

4. Interação:
   - Edição inline de campos de perfil
   - Toggles para configurações binárias
   - Confirmação para alterações sensíveis
   - Feedback visual para ações realizadas
   - Pesquisa dentro das configurações

5. Recursos adicionais:
   - Exportação de dados da conta
   - Verificação de segurança da conta com recomendações
   - Personalização da aparência do painel
   - Logs detalhados de atividades
   - Backup e restauração de configurações
```

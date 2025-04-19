# Prompt Otimizado: Jogos e Aplicações Interativas

## Quiz Interativo

```
Crie um quiz interativo com as seguintes especificações:

1. Funcionalidade:
   - Apresentar perguntas de múltipla escolha com 4 opções de resposta
   - Exibir feedback imediato após cada resposta (correto/incorreto)
   - Calcular e mostrar pontuação final ao término do quiz
   - Temporizador para cada pergunta (15 segundos)
   - Permitir reiniciar o quiz ao final
   - Exibir progresso atual (pergunta X de Y)
   - Mostrar explicação da resposta correta após cada questão

2. Design:
   - Interface colorida e divertida com tema de conhecimentos gerais
   - Esquema de cores: fundo roxo claro (#f3e5f5), elementos em roxo escuro (#7b1fa2), verde (#4caf50) para respostas corretas, vermelho (#f44336) para incorretas
   - Layout centralizado com cards para perguntas
   - Animações para transições entre perguntas
   - Design responsivo para desktop e mobile
   - Inspirado em aplicativos como Kahoot/Quizizz

3. Dados:
   - Banco de pelo menos 15 perguntas de conhecimentos gerais
   - Estrutura de dados JSON para perguntas, respostas e explicações
   - Categorias variadas: História, Ciência, Geografia, Entretenimento, Esportes
   - Níveis de dificuldade: fácil, médio, difícil

4. Interação:
   - Feedback visual e sonoro para respostas
   - Destaque da opção correta após resposta
   - Barra de progresso para o temporizador
   - Botões grandes e acessíveis para seleção de respostas
   - Transições suaves entre perguntas

5. Recursos adicionais:
   - Sistema de recordes (highscores) usando localStorage
   - Modo de revisão para ver todas as perguntas e respostas corretas
   - Opção para selecionar categorias específicas
   - Compartilhamento de resultados
   - Efeitos sonoros para acertos/erros (com opção de silenciar)
```

## Jogo de Memória

```
Crie um jogo de memória (memory card game) com as seguintes especificações:

1. Funcionalidade:
   - Gerar um tabuleiro com pares de cartas viradas para baixo
   - Permitir virar duas cartas por vez para encontrar pares
   - Remover pares correspondentes do jogo
   - Contar o número de tentativas e tempo decorrido
   - Detectar quando todos os pares foram encontrados
   - Oferecer diferentes níveis de dificuldade (4x4, 6x6, 8x8)
   - Embaralhar cartas ao iniciar novo jogo

2. Design:
   - Interface lúdica e atraente com tema colorido
   - Esquema de cores: fundo azul claro (#e3f2fd), cartas em azul (#2196f3), detalhes em amarelo (#ffc107)
   - Cartas com design atraente (ícones ou imagens)
   - Animações suaves para virar cartas
   - Layout responsivo que adapta o tamanho das cartas ao dispositivo
   - Design inspirado em jogos casuais para todas as idades

3. Dados:
   - Conjunto de pelo menos 32 pares de ícones/imagens
   - Armazenamento de melhores pontuações usando localStorage
   - Temas diferentes para as cartas (animais, frutas, símbolos)

4. Interação:
   - Animação de flip 3D para as cartas
   - Feedback visual para pares corretos/incorretos
   - Destaque temporário para cartas não correspondentes
   - Controles simples (clique/toque)
   - Transições suaves entre estados do jogo

5. Recursos adicionais:
   - Sistema de pontuação baseado em tempo e tentativas
   - Tabela de classificação dos melhores resultados
   - Modo contra o tempo
   - Efeitos sonoros para ações (virar carta, encontrar par)
   - Opção para escolher diferentes temas visuais
```

## Simulador de Sorteio Avançado

```
Crie um simulador de sorteio avançado com as seguintes especificações:

1. Funcionalidade:
   - Adicionar participantes individualmente ou em massa (colar lista)
   - Remover participantes individualmente ou limpar todos
   - Configurar número de vencedores a serem sorteados
   - Realizar sorteio com animação
   - Excluir vencedores anteriores de novos sorteios (opcional)
   - Salvar e carregar listas de participantes
   - Exportar resultados do sorteio

2. Design:
   - Interface moderna e profissional
   - Esquema de cores: fundo branco, elementos em verde (#4caf50), detalhes em cinza (#9e9e9e)
   - Layout dividido em seções: configuração, lista de participantes, resultados
   - Animação de roleta/tambor durante o sorteio
   - Design responsivo para uso em apresentações ou eventos
   - Inspirado em ferramentas de sorteio profissionais

3. Dados:
   - Armazenamento de participantes em array/JSON
   - Persistência de configurações usando localStorage
   - Histórico de sorteios anteriores
   - Exportação de dados em formato CSV/JSON

4. Interação:
   - Arrastar e soltar para reordenar participantes
   - Animação dramática durante o sorteio (roleta girando, nomes embaralhando)
   - Contagem regressiva antes de revelar o vencedor
   - Feedback sonoro para aumentar a expectativa
   - Confirmação antes de ações irreversíveis

5. Recursos adicionais:
   - Opção para atribuir pesos diferentes aos participantes
   - Modo de apresentação em tela cheia
   - Personalização de cores e animações
   - Temporizador para sorteios automáticos
   - Integração com webcam para mostrar reações (opcional)
```

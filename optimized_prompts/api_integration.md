# Prompt Otimizado: Integrações com APIs

## Aplicação de Previsão do Tempo

```
Crie uma aplicação de previsão do tempo com as seguintes especificações:

1. Funcionalidade:
   - Buscar dados meteorológicos atuais e previsão para 7 dias usando a API OpenWeatherMap
   - Permitir busca por cidade ou detecção automática de localização
   - Exibir condições atuais (temperatura, umidade, velocidade do vento, pressão atmosférica)
   - Mostrar previsão horária para as próximas 24 horas
   - Exibir previsão diária para os próximos 7 dias
   - Alternar entre unidades métricas (Celsius) e imperiais (Fahrenheit)
   - Exibir alertas meteorológicos quando disponíveis

2. Design:
   - Interface limpa e visual com tema que muda de acordo com as condições climáticas e hora do dia
   - Esquema de cores: tons de azul (#1e88e5) para dias ensolarados, cinza (#607d8b) para nublado, azul escuro (#1a237e) para noite
   - Ícones animados para diferentes condições climáticas
   - Layout responsivo com visualização detalhada em desktop e compacta em mobile
   - Design inspirado em aplicativos como AccuWeather/Weather Channel

3. Dados:
   - Integração com API OpenWeatherMap (deixar espaço para inserção da chave de API)
   - Armazenamento em cache das últimas consultas usando localStorage
   - Histórico de cidades pesquisadas
   - Conversão automática de coordenadas para nomes de cidades

4. Interação:
   - Autocompletar na busca de cidades
   - Swipe horizontal para navegar entre dias na previsão
   - Gráficos interativos para temperatura e precipitação
   - Animações suaves para transições de dados
   - Indicadores de carregamento durante requisições à API

5. Recursos adicionais:
   - Mapa interativo com radar de precipitação
   - Gráficos de tendências para temperatura e precipitação
   - Notificações para mudanças significativas no clima
   - Modo offline com últimos dados consultados
   - Widget para página inicial com resumo do clima
```

## Conversor de Moedas com API

```
Crie um conversor de moedas com as seguintes especificações:

1. Funcionalidade:
   - Converter entre mais de 30 moedas diferentes usando a API ExchangeRate
   - Exibir taxas de câmbio em tempo real
   - Permitir inversão rápida entre moedas de origem e destino
   - Mostrar histórico de taxas de câmbio (últimos 7 dias)
   - Calcular conversão automaticamente ao digitar
   - Salvar conversões favoritas para acesso rápido
   - Atualizar taxas automaticamente a cada hora

2. Design:
   - Interface limpa e profissional com tema financeiro
   - Esquema de cores: verde (#4caf50) para elementos principais, branco para fundo, cinza (#9e9e9e) para detalhes
   - Layout com dois painéis principais (origem e destino)
   - Bandeiras de países ao lado dos códigos de moeda
   - Gráficos minimalistas para histórico de taxas
   - Design responsivo otimizado para mobile

3. Dados:
   - Integração com API ExchangeRate (deixar espaço para inserção da chave de API)
   - Cache local de taxas recentes usando localStorage
   - Lista completa de moedas com nomes e códigos
   - Histórico de conversões realizadas

4. Interação:
   - Seleção de moeda com pesquisa rápida
   - Atualização em tempo real dos valores ao digitar
   - Botão de inversão de moedas com animação
   - Tooltips informativos sobre cada moeda
   - Feedback visual durante atualização de taxas

5. Recursos adicionais:
   - Calculadora financeira integrada
   - Notificações para mudanças significativas em taxas favoritas
   - Modo offline com últimas taxas conhecidas
   - Temas claro/escuro
   - Exportação de histórico de conversões em CSV
```

## Agregador de Notícias

```
Crie um agregador de notícias com as seguintes especificações:

1. Funcionalidade:
   - Buscar notícias de múltiplas fontes usando a API News API
   - Categorizar notícias (política, tecnologia, esportes, entretenimento, etc.)
   - Permitir busca por palavras-chave
   - Filtrar por data, fonte e relevância
   - Exibir manchetes, imagens e resumos
   - Salvar artigos para leitura posterior
   - Recomendar artigos relacionados

2. Design:
   - Interface moderna tipo feed de notícias
   - Esquema de cores: branco para fundo, azul (#2196f3) para elementos de ação, cinza para texto
   - Cards para cada notícia com imagem destacada
   - Layout responsivo com 3 colunas em desktop, 2 em tablet e 1 em mobile
   - Design inspirado em sites como Flipboard/Google News

3. Dados:
   - Integração com News API (deixar espaço para inserção da chave de API)
   - Cache local de artigos recentes
   - Armazenamento de artigos salvos usando localStorage
   - Histórico de buscas recentes

4. Interação:
   - Scroll infinito para carregar mais notícias
   - Animações suaves ao abrir/fechar artigos
   - Compartilhamento direto para redes sociais
   - Modo de leitura com distração reduzida
   - Indicadores de carregamento durante requisições

5. Recursos adicionais:
   - Modo escuro para leitura noturna
   - Personalização de fontes preferidas
   - Notificações para notícias importantes
   - Estatísticas de leitura (tempo gasto, artigos lidos)
   - Resumo diário das principais notícias
```

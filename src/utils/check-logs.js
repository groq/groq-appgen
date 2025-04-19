// Script para verificar os logs de análise UX
const fs = require('fs');
const path = require('path');

// Verificar se há logs no localStorage (simulado)
console.log('Verificando logs de análise UX...');

// Verificar se há logs no console do navegador
console.log('Por favor, verifique o console do navegador para ver os logs completos.');
console.log('Os logs devem incluir:');
console.log('1. "Resultado da análise UX:"');
console.log('2. "=== ANÁLISE DE UX ==="');
console.log('3. "=== PLANO DE AÇÃO ==="');

// Verificar se há arquivos de log no sistema de arquivos
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (fs.existsSync(logsDir)) {
  const files = fs.readdirSync(logsDir);
  console.log('Arquivos de log encontrados:', files);
  
  // Verificar o conteúdo do arquivo de log mais recente
  if (files.length > 0) {
    const latestLog = files.sort().reverse()[0];
    const logContent = fs.readFileSync(path.join(logsDir, latestLog), 'utf8');
    console.log('Conteúdo do log mais recente:', logContent.substring(0, 500) + '...');
  }
} else {
  console.log('Diretório de logs não encontrado. Os logs estão sendo armazenados apenas na memória.');
}

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function testFeedback() {
  console.log('Testando funcionalidade de feedback...');
  
  // Carregar o HTML gerado anteriormente
  const outputDir = path.join(__dirname, '../test-output');
  const files = fs.readdirSync(outputDir).filter(file => file.startsWith('counter-app-'));
  
  if (files.length === 0) {
    console.error('Nenhum arquivo HTML encontrado. Execute test-generation.js primeiro.');
    return;
  }
  
  // Usar o arquivo mais recente
  const latestFile = files.sort().pop();
  const htmlPath = path.join(outputDir, latestFile);
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  console.log(`Usando HTML do arquivo: ${htmlPath}`);
  
  const sessionId = uuidv4();
  const feedback = 'Add a dark/light theme toggle button and make the counter text change color based on whether it\'s positive, negative, or zero';
  
  try {
    console.log(`Enviando feedback: "${feedback}"`);
    
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentHtml: html,
        feedback,
        theme: 'dark',
        model: 'llama-3.3-70b-versatile',
        stream: false,
        sessionId,
        version: '1',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Resposta recebida com sucesso!');
    
    if (result.html) {
      console.log('\nHTML atualizado (primeiros 200 caracteres):');
      console.log(result.html.substring(0, 200) + '...');
      console.log('\nAssinatura:', result.signature);
      console.log('\nTeste concluído com sucesso!');
      
      // Salvar o HTML atualizado em um arquivo para inspeção
      const outputFile = path.join(outputDir, `counter-app-updated-${Date.now()}.html`);
      fs.writeFileSync(outputFile, result.html);
      console.log(`\nHTML atualizado salvo em: ${outputFile}`);
    } else {
      console.log('Resposta não contém HTML:', result);
    }
  } catch (error) {
    console.error('Erro ao testar feedback:', error);
  }
}

testFeedback();

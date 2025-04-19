const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

async function testGeneration() {
  console.log('Testando geração de código...');

  const sessionId = uuidv4();
  const prompt = 'Create a simple counter app with HTML, CSS and JavaScript';

  try {
    console.log(`Enviando prompt: "${prompt}"`);

    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        currentHtml: '',
        theme: 'dark',
        model: 'llama-3.3-70b-versatile',
        stream: false, // Desativando streaming para simplificar o teste
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
      console.log('\nHTML gerado (primeiros 200 caracteres):');
      console.log(result.html.substring(0, 200) + '...');
      console.log('\nAssinatura:', result.signature);
      console.log('\nTeste concluído com sucesso!');

      // Salvar o HTML em um arquivo para inspeção
      const fs = require('fs');
      const path = require('path');
      const outputDir = path.join(__dirname, '../test-output');

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputFile = path.join(outputDir, `counter-app-${Date.now()}.html`);
      fs.writeFileSync(outputFile, result.html);
      console.log(`\nHTML salvo em: ${outputFile}`);
    } else {
      console.log('Resposta não contém HTML:', result);
    }
  } catch (error) {
    console.error('Erro ao testar geração:', error);
  }
}

testGeneration();

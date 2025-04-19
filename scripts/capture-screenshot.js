const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureScreenshot() {
  console.log('Iniciando captura de tela...');

  // Certifique-se de que o diretório de screenshots existe
  const screenshotsDir = path.join(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Definir viewport para capturar toda a página
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    console.log('Navegando para http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Esperar um pouco para garantir que tudo carregou
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Capturar screenshot
    const screenshotPath = path.join(screenshotsDir, `nexus-gen-${Date.now()}.png`);
    console.log(`Capturando screenshot para ${screenshotPath}...`);

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`Screenshot salvo em: ${screenshotPath}`);
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshot();

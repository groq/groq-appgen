const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshot() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log('Opening new page...');
    const page = await browser.newPage();
    
    // Set viewport to a common screen size
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    
    // Navigate to the local development server
    console.log('Navigating to app...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // Wait for the main content to be visible
    await page.waitForSelector('body', { visible: true });
    
    // Wait a bit for animations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
    
    // Take screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: filePath, fullPage: true });
    
    console.log(`Screenshot saved to: ${filePath}`);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshot();

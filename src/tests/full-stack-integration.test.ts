/**
 * Testes para a Integração Full Stack
 */

import { generateFullStackApp, deployFullStackApp } from '@/utils/full-stack-service';
import { parseActions } from '@/utils/action-parser';
import { ActionExecutor } from '@/utils/action-executor';
import { initWebContainer, createFiles, startServer } from '@/utils/web-container-service';
import { generateAgenticResponse } from '@/utils/agentic-service';

// Mocks
jest.mock('@/utils/agentic-service', () => ({
  generateAgenticResponse: jest.fn().mockResolvedValue({
    choices: [{ 
      message: { 
        content: `
          <action type="file" filePath="src/index.js">
          console.log('Hello, world!');
          </action>
          
          <action type="file" filePath="src/App.js">
          import React from 'react';
          
          function App() {
            return <div>Hello, world!</div>;
          }
          
          export default App;
          </action>
          
          <action type="file" filePath="server.js">
          const express = require('express');
          const app = express();
          
          app.get('/', (req, res) => {
            res.send('Hello, world!');
          });
          
          app.listen(3000, () => {
            console.log('Server running on port 3000');
          });
          </action>
          
          <action type="shell">
          npm install express
          </action>
        `
      } 
    }]
  })
}));

jest.mock('@/utils/action-parser', () => ({
  parseActions: jest.fn().mockImplementation((content) => {
    // Implementação simplificada para testes
    const actions = [];
    
    if (content.includes('src/index.js')) {
      actions.push({
        type: 'file',
        filePath: 'src/index.js',
        content: "console.log('Hello, world!');"
      });
    }
    
    if (content.includes('src/App.js')) {
      actions.push({
        type: 'file',
        filePath: 'src/App.js',
        content: "import React from 'react'; function App() { return <div>Hello, world!</div>; } export default App;"
      });
    }
    
    if (content.includes('server.js')) {
      actions.push({
        type: 'file',
        filePath: 'server.js',
        content: "const express = require('express'); const app = express(); app.get('/', (req, res) => { res.send('Hello, world!'); }); app.listen(3000);"
      });
    }
    
    if (content.includes('npm install')) {
      actions.push({
        type: 'shell',
        content: 'npm install express'
      });
    }
    
    return actions;
  })
}));

jest.mock('@/utils/action-executor', () => ({
  ActionExecutor: jest.fn().mockImplementation(() => ({
    executeActions: jest.fn().mockResolvedValue(undefined),
    getProgressTracker: jest.fn().mockReturnValue({
      getSteps: jest.fn().mockReturnValue([
        { id: 'step1', title: 'Create files', status: 'complete' },
        { id: 'step2', title: 'Install dependencies', status: 'complete' }
      ])
    }),
    getFileManager: jest.fn().mockReturnValue({
      getFiles: jest.fn().mockReturnValue(new Map([
        ['src/index.js', "console.log('Hello, world!');"],
        ['src/App.js', "import React from 'react'; function App() { return <div>Hello, world!</div>; } export default App;"],
        ['server.js', "const express = require('express'); const app = express(); app.get('/', (req, res) => { res.send('Hello, world!'); }); app.listen(3000);"]
      ]))
    })
  }))
}));

jest.mock('@/utils/web-container-service', () => ({
  initWebContainer: jest.fn().mockResolvedValue({}),
  createFiles: jest.fn().mockResolvedValue(undefined),
  startServer: jest.fn().mockResolvedValue('http://localhost:3000')
}));

describe('Full Stack Integration', () => {
  describe('generateFullStackApp', () => {
    test('should generate full stack app correctly', async () => {
      const prompt = 'Create a simple React app with Express backend';
      const result = await generateFullStackApp(prompt);
      
      expect(result.files).toBeDefined();
      expect(result.files.size).toBe(3);
      expect(result.files.has('src/index.js')).toBe(true);
      expect(result.files.has('src/App.js')).toBe(true);
      expect(result.files.has('server.js')).toBe(true);
      
      expect(result.steps).toBeDefined();
      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].status).toBe('complete');
      expect(result.steps[1].status).toBe('complete');
      
      // Verificar se as funções corretas foram chamadas
      expect(generateAgenticResponse).toHaveBeenCalled();
      expect(parseActions).toHaveBeenCalled();
    });
  });
  
  describe('deployFullStackApp', () => {
    test('should deploy full stack app correctly', async () => {
      const files = new Map([
        ['src/index.js', "console.log('Hello, world!');"],
        ['src/App.js', "import React from 'react'; function App() { return <div>Hello, world!</div>; } export default App;"],
        ['server.js', "const express = require('express'); const app = express(); app.get('/', (req, res) => { res.send('Hello, world!'); }); app.listen(3000);"]
      ]);
      
      const result = await deployFullStackApp(files);
      
      expect(result.url).toBe('http://localhost:3000');
      
      // Verificar se as funções corretas foram chamadas
      expect(initWebContainer).toHaveBeenCalled();
      expect(createFiles).toHaveBeenCalled();
      expect(startServer).toHaveBeenCalled();
    });
  });
});

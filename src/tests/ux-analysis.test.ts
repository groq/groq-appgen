/**
 * Testes para o Sistema de Análise UX
 */

import { analyzeUX, captureScreenshot, generateUXReport } from '@/utils/ux-analysis-service';
import { analyzeImage } from '@/utils/vision-service';

// Mock para o serviço de visão
jest.mock('@/utils/vision-service', () => ({
  analyzeImage: jest.fn().mockResolvedValue({
    choices: [{ 
      message: { 
        content: JSON.stringify({
          score: 85,
          issues: [
            { type: 'contrast', description: 'Low contrast between text and background' },
            { type: 'spacing', description: 'Inconsistent spacing between elements' }
          ],
          recommendations: [
            'Increase contrast ratio to at least 4.5:1',
            'Standardize spacing using a consistent grid system'
          ]
        })
      } 
    }]
  })
}));

// Mock para captura de tela
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test')
  })
}));

describe('UX Analysis System', () => {
  describe('captureScreenshot', () => {
    test('should capture screenshot correctly', async () => {
      const element = document.createElement('div');
      const screenshot = await captureScreenshot(element);
      
      expect(screenshot).toBe('data:image/png;base64,test');
    });
  });
  
  describe('analyzeUX', () => {
    test('should analyze UX correctly', async () => {
      const screenshot = 'data:image/png;base64,test';
      const result = await analyzeUX(screenshot);
      
      expect(result.score).toBe(85);
      expect(result.issues).toHaveLength(2);
      expect(result.recommendations).toHaveLength(2);
    });
  });
  
  describe('generateUXReport', () => {
    test('should generate UX report correctly', async () => {
      const element = document.createElement('div');
      const report = await generateUXReport(element);
      
      expect(report.screenshot).toBe('data:image/png;base64,test');
      expect(report.analysis.score).toBe(85);
      expect(report.analysis.issues).toHaveLength(2);
      expect(report.analysis.recommendations).toHaveLength(2);
    });
  });
});

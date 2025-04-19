/**
 * Testes para o Executor de Ações
 */

import { ActionExecutor, FileManager, ProgressTracker } from '@/utils/action-executor';
import { Action } from '@/utils/action-parser';

describe('Action Executor', () => {
  describe('FileManager', () => {
    test('should create and retrieve files correctly', async () => {
      const fileManager = new FileManager();
      
      await fileManager.createFile('src/index.js', 'console.log("Hello");');
      
      const files = fileManager.getFiles();
      expect(files.size).toBe(1);
      expect(files.get('src/index.js')).toBe('console.log("Hello");');
    });
    
    test('should handle nested directories correctly', async () => {
      const fileManager = new FileManager();
      
      await fileManager.createFile('src/components/Button.js', 'export default Button;');
      
      const files = fileManager.getFiles();
      expect(files.size).toBe(1);
      expect(files.get('src/components/Button.js')).toBe('export default Button;');
    });
    
    test('should simulate shell command execution', async () => {
      const fileManager = new FileManager();
      
      const output = await fileManager.executeShellCommand('npm install react');
      
      expect(output).toContain('npm install react');
    });
  });
  
  describe('ProgressTracker', () => {
    test('should track progress correctly', () => {
      const progressTracker = new ProgressTracker();
      
      progressTracker.addStep('step1', 'Step 1', 'Description 1');
      
      const steps = progressTracker.getSteps();
      expect(steps).toHaveLength(1);
      expect(steps[0].id).toBe('step1');
      expect(steps[0].status).toBe('pending');
    });
    
    test('should update step status correctly', () => {
      const progressTracker = new ProgressTracker();
      
      progressTracker.addStep('step1', 'Step 1');
      progressTracker.startStep('step1');
      
      let steps = progressTracker.getSteps();
      expect(steps[0].status).toBe('running');
      
      progressTracker.completeStep('step1');
      
      steps = progressTracker.getSteps();
      expect(steps[0].status).toBe('complete');
    });
    
    test('should handle step failure correctly', () => {
      const progressTracker = new ProgressTracker();
      
      progressTracker.addStep('step1', 'Step 1');
      progressTracker.failStep('step1', 'Error message');
      
      const steps = progressTracker.getSteps();
      expect(steps[0].status).toBe('failed');
      expect(steps[0].error).toBe('Error message');
    });
  });
  
  describe('ActionExecutor', () => {
    test('should execute actions correctly', async () => {
      const executor = new ActionExecutor();
      
      const actions: Action[] = [
        {
          type: 'file',
          filePath: 'src/index.js',
          content: 'console.log("Hello");'
        },
        {
          type: 'shell',
          content: 'npm install react'
        }
      ];
      
      await executor.executeActions(actions);
      
      const steps = executor.getProgressTracker().getSteps();
      expect(steps).toHaveLength(2);
      expect(steps[0].status).toBe('complete');
      expect(steps[1].status).toBe('complete');
      
      const files = executor.getFileManager().getFiles();
      expect(files.size).toBe(1);
      expect(files.get('src/index.js')).toBe('console.log("Hello");');
    });
  });
});

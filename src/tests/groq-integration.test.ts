/**
 * Testes para a Integração com Groq
 */

import { generateResponse } from '@/utils/ai-service';
import { generateAgenticResponse } from '@/utils/agentic-service';
import { executeCode, generateAndExecuteCode } from '@/utils/code-execution-service';
import { analyzeImage } from '@/utils/vision-service';
import { generateReasoningResponse } from '@/utils/reasoning-service';
import { speechToText, textToSpeech } from '@/utils/speech-service';

// Mock para o cliente Groq
jest.mock('groq-sdk', () => {
  return {
    Groq: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test response' } }]
          })
        }
      },
      audio: {
        transcriptions: {
          create: jest.fn().mockResolvedValue({
            text: 'Transcribed text'
          })
        },
        speech: {
          create: jest.fn().mockResolvedValue({
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10))
          })
        }
      }
    }))
  };
});

describe('Groq Integration', () => {
  describe('AI Service', () => {
    test('should generate response correctly', async () => {
      const messages = [{ role: 'user', content: 'Hello' }];
      const response = await generateResponse(messages, false);
      
      expect(response).toBe('Test response');
    });
  });
  
  describe('Agentic Service', () => {
    test('should generate agentic response correctly', async () => {
      const messages = [{ role: 'user', content: 'Hello' }];
      const response = await generateAgenticResponse(messages, false);
      
      expect(response.choices[0].message.content).toBe('Test response');
    });
  });
  
  describe('Code Execution Service', () => {
    test('should execute code correctly', async () => {
      const code = 'console.log("Hello");';
      const result = await executeCode(code, 'javascript');
      
      expect(result).toBe('Test response');
    });
    
    test('should generate and execute code correctly', async () => {
      const description = 'Print hello world';
      const result = await generateAndExecuteCode(description, 'javascript');
      
      expect(result.code).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });
  
  describe('Vision Service', () => {
    test('should analyze image correctly', async () => {
      const imageUrl = 'https://example.com/image.jpg';
      const prompt = 'Describe this image';
      const result = await analyzeImage(imageUrl, prompt, false);
      
      expect(result.choices[0].message.content).toBe('Test response');
    });
  });
  
  describe('Reasoning Service', () => {
    test('should generate reasoning response correctly', async () => {
      const messages = [{ role: 'user', content: 'Hello' }];
      const result = await generateReasoningResponse(messages, false);
      
      expect(result.choices[0].message.content).toBe('Test response');
    });
  });
  
  describe('Speech Service', () => {
    test('should convert speech to text correctly', async () => {
      const audioBuffer = Buffer.from('test');
      const result = await speechToText(audioBuffer);
      
      expect(result).toBe('Transcribed text');
    });
    
    test('should convert text to speech correctly', async () => {
      const text = 'Hello';
      const result = await textToSpeech(text);
      
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});

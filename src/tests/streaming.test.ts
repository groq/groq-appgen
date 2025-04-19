/**
 * Testes para o sistema de streaming
 */

import { generateResponse } from '@/utils/ai-service';
import { generateAgenticResponse } from '@/utils/agentic-service';

// Mock para o cliente Groq
jest.mock('groq-sdk', () => {
  return {
    Groq: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockImplementation(({ stream }) => {
            if (stream) {
              // Simular um stream
              const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                  yield { choices: [{ delta: { content: 'Chunk 1' } }] };
                  yield { choices: [{ delta: { content: 'Chunk 2' } }] };
                  yield { choices: [{ delta: { content: 'Chunk 3' } }] };
                }
              };
              return mockStream;
            } else {
              // Simular uma resposta normal
              return Promise.resolve({
                choices: [{ message: { content: 'Complete response' } }]
              });
            }
          })
        }
      }
    }))
  };
});

describe('Streaming System', () => {
  test('generateResponse should return a string when stream is false', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    const response = await generateResponse(messages, false);

    expect(typeof response).toBe('string');
    expect(response).toBe('Complete response');
  });

  test('generateResponse should return a ReadableStream when stream is true', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    const response = await generateResponse(messages, true);

    // Verificar se é um ReadableStream
    expect(response).toBeDefined();
    expect(typeof response.getReader).toBe('function');
  });

  test('generateAgenticResponse should handle streaming correctly', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    const response = await generateAgenticResponse(messages, true);

    // Verificar se é um objeto iterável
    expect(typeof response[Symbol.asyncIterator]).toBe('function');

    // Consumir o stream
    let chunks = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBe(3);
    expect(chunks[0].choices[0].delta.content).toBe('Chunk 1');
    expect(chunks[1].choices[0].delta.content).toBe('Chunk 2');
    expect(chunks[2].choices[0].delta.content).toBe('Chunk 3');
  });
});

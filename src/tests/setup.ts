/**
 * Configuração para testes
 */

// Mock para o WebContainer
jest.mock('@webcontainer/api', () => ({
  WebContainer: {
    boot: jest.fn().mockResolvedValue({
      mount: jest.fn().mockResolvedValue(undefined),
      spawn: jest.fn().mockResolvedValue({
        output: {
          pipeTo: jest.fn()
        },
        stderr: {
          pipeTo: jest.fn()
        },
        exit: Promise.resolve(0),
        ready: Promise.resolve()
      }),
      iframe: {
        setPort: jest.fn().mockResolvedValue('http://localhost:3000')
      }
    })
  }
}));

// Mock para fetch
global.fetch = jest.fn().mockImplementation((url) => {
  if (url === '/api/web-container') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        url: 'http://localhost:3000',
        stdout: 'Command executed successfully',
        stderr: '',
        exitCode: 0
      })
    });
  }

  if (url === '/api/execute-code') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        result: 'Code executed successfully',
        code: 'console.log("Hello World");'
      })
    });
  }

  if (url === '/api/agentic-chat') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        response: 'This is a response from the AI',
        tool_calls: []
      })
    });
  }

  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({
      error: 'Not found'
    })
  });
});

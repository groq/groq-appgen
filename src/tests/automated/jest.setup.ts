// Configuração global para os testes Jest

// Mock do objeto window
global.window = Object.create(window);

// Mock do objeto document
global.document = Object.create(document);

// Mock do objeto localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock do objeto sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock do objeto navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'node.js',
    language: 'en-US',
    languages: ['en-US', 'en'],
    clipboard: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      readText: jest.fn().mockImplementation(() => Promise.resolve('')),
    },
  },
  writable: true,
});

// Mock do objeto location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock do objeto fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })
);

// Mock do objeto console
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock do TextEncoder e TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock do TransformStream
global.TransformStream = class TransformStream {
  constructor() {
    this.writable = {
      getWriter: () => ({
        write: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        abort: jest.fn().mockResolvedValue(undefined),
      }),
    };
    this.readable = new ReadableStream();
  }
};

// Mock do ReadableStream
global.ReadableStream = class ReadableStream {
  constructor() {}
  getReader() {
    return {
      read: jest.fn().mockResolvedValue({ done: true, value: undefined }),
      releaseLock: jest.fn(),
    };
  }
};

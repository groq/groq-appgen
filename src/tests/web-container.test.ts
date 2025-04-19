/**
 * Testes para o serviço de WebContainer
 */

import { convertFilesToWebContainerFormat } from '@/utils/web-container-service';
import { FileTreeItem } from '@/types/file-types';

describe('WebContainer Service', () => {
  describe('convertFilesToWebContainerFormat', () => {
    it('should convert files to WebContainer format', () => {
      // Arrange
      const files: FileTreeItem[] = [
        {
          name: 'index.js',
          type: 'file',
          path: 'index.js',
          content: 'console.log("Hello World");',
          language: 'javascript'
        },
        {
          name: 'src',
          type: 'directory',
          path: 'src',
          children: [
            {
              name: 'app.js',
              type: 'file',
              path: 'src/app.js',
              content: 'export default function App() { return "App"; }',
              language: 'javascript'
            }
          ]
        }
      ];

      // Act
      const result = convertFilesToWebContainerFormat(files);

      // Assert
      expect(result).toEqual({
        'index.js': {
          file: {
            contents: 'console.log("Hello World");'
          }
        },
        'src': {
          directory: {
            'app.js': {
              file: {
                contents: 'export default function App() { return "App"; }'
              }
            }
          }
        }
      });
    });

    it('should handle empty files', () => {
      // Arrange
      const files: FileTreeItem[] = [
        {
          name: 'empty.js',
          type: 'file',
          path: 'empty.js',
          content: '',
          language: 'javascript'
        }
      ];

      // Act
      const result = convertFilesToWebContainerFormat(files);

      // Assert
      expect(result).toEqual({
        'empty.js': {
          file: {
            contents: ''
          }
        }
      });
    });

    it('should handle empty directories', () => {
      // Arrange
      const files: FileTreeItem[] = [
        {
          name: 'empty',
          type: 'directory',
          path: 'empty',
          children: []
        }
      ];

      // Act
      const result = convertFilesToWebContainerFormat(files);

      // Assert
      expect(result).toEqual({
        'empty': {
          directory: {}
        }
      });
    });
  });
});

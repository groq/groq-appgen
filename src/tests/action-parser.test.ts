/**
 * Testes para o serviço de Action Parser
 */

import { parseActions, parseArtifacts } from '@/utils/action-parser';

describe('Action Parser', () => {
  describe('parseActions', () => {
    it('should parse file actions', () => {
      // Arrange
      const message = `
        Here's a file action:
        <action type="file" filePath="index.js">console.log("Hello World");</action>
      `;

      // Act
      const actions = parseActions(message);

      // Assert
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'file',
        filePath: 'index.js',
        content: 'console.log("Hello World");'
      });
    });

    it('should parse shell actions', () => {
      // Arrange
      const message = `
        Here's a shell action:
        <action type="shell">npm install react</action>
      `;

      // Act
      const actions = parseActions(message);

      // Assert
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'shell',
        content: 'npm install react'
      });
    });

    it('should parse multiple actions', () => {
      // Arrange
      const message = `
        Here are multiple actions:
        <action type="file" filePath="index.js">console.log("Hello World");</action>
        <action type="shell">npm install react</action>
      `;

      // Act
      const actions = parseActions(message);

      // Assert
      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual({
        type: 'file',
        filePath: 'index.js',
        content: 'console.log("Hello World");'
      });
      expect(actions[1]).toEqual({
        type: 'shell',
        content: 'npm install react'
      });
    });

    it('should handle actions with multiline content', () => {
      // Arrange
      const message = `
        Here's an action with multiline content:
        <action type="file" filePath="index.js">
          function hello() {
            console.log("Hello World");
          }
          
          hello();
        </action>
      `;

      // Act
      const actions = parseActions(message);

      // Assert
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'file',
        filePath: 'index.js',
        content: `
          function hello() {
            console.log("Hello World");
          }
          
          hello();
        `.trim()
      });
    });
  });

  describe('parseArtifacts', () => {
    it('should parse artifacts', () => {
      // Arrange
      const message = `
        Here's an artifact:
        <boltArtifact id="123" title="Hello World">
          <action type="file" filePath="index.js">console.log("Hello World");</action>
        </boltArtifact>
      `;

      // Act
      const artifacts = parseArtifacts(message);

      // Assert
      expect(artifacts).toHaveLength(1);
      expect(artifacts[0]).toEqual({
        id: '123',
        title: 'Hello World',
        actions: [
          {
            type: 'file',
            filePath: 'index.js',
            content: 'console.log("Hello World");'
          }
        ]
      });
    });

    it('should parse artifacts with multiple actions', () => {
      // Arrange
      const message = `
        Here's an artifact with multiple actions:
        <boltArtifact id="123" title="Hello World">
          <action type="file" filePath="index.js">console.log("Hello World");</action>
          <action type="shell">npm install react</action>
        </boltArtifact>
      `;

      // Act
      const artifacts = parseArtifacts(message);

      // Assert
      expect(artifacts).toHaveLength(1);
      expect(artifacts[0]).toEqual({
        id: '123',
        title: 'Hello World',
        actions: [
          {
            type: 'file',
            filePath: 'index.js',
            content: 'console.log("Hello World");'
          },
          {
            type: 'shell',
            content: 'npm install react'
          }
        ]
      });
    });

    it('should parse multiple artifacts', () => {
      // Arrange
      const message = `
        Here are multiple artifacts:
        <boltArtifact id="123" title="Hello World">
          <action type="file" filePath="index.js">console.log("Hello World");</action>
        </boltArtifact>
        <boltArtifact id="456" title="React App">
          <action type="file" filePath="app.js">import React from 'react';</action>
        </boltArtifact>
      `;

      // Act
      const artifacts = parseArtifacts(message);

      // Assert
      expect(artifacts).toHaveLength(2);
      expect(artifacts[0]).toEqual({
        id: '123',
        title: 'Hello World',
        actions: [
          {
            type: 'file',
            filePath: 'index.js',
            content: 'console.log("Hello World");'
          }
        ]
      });
      expect(artifacts[1]).toEqual({
        id: '456',
        title: 'React App',
        actions: [
          {
            type: 'file',
            filePath: 'app.js',
            content: "import React from 'react';"
          }
        ]
      });
    });
  });
});

/**
 * Serviço para gerenciamento de templates de projetos
 */

import { FileTreeItem } from '@/types/file-types';

/**
 * Interface para um template de projeto
 */
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'other';
  technologies: string[];
  files: FileTreeItem[];
  setupCommands: string[];
  startCommand: string;
  thumbnail?: string;
}

/**
 * Lista de templates de projetos disponíveis
 */
export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'react-basic',
    name: 'React Básico',
    description: 'Aplicação React básica com estrutura de componentes e estilização CSS',
    category: 'frontend',
    technologies: ['React', 'JavaScript', 'CSS'],
    files: [
      {
        name: 'package.json',
        type: 'file',
        path: 'package.json',
        content: `{
  "name": "react-basic-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
        language: 'json'
      },
      {
        name: 'index.html',
        type: 'file',
        path: 'public/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
        language: 'html'
      },
      {
        name: 'index.js',
        type: 'file',
        path: 'src/index.js',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: 'javascript'
      },
      {
        name: 'App.js',
        type: 'file',
        path: 'src/App.js',
        content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Basic App</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </header>
    </div>
  );
}

export default App;`,
        language: 'javascript'
      },
      {
        name: 'App.css',
        type: 'file',
        path: 'src/App.css',
        content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

button {
  background-color: #61dafb;
  border: none;
  color: #282c34;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}`,
        language: 'css'
      },
      {
        name: 'index.css',
        type: 'file',
        path: 'src/index.css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
        language: 'css'
      }
    ],
    setupCommands: ['npm install'],
    startCommand: 'npm start'
  },
  {
    id: 'express-api',
    name: 'Express API',
    description: 'API RESTful com Express.js e estrutura MVC',
    category: 'backend',
    technologies: ['Node.js', 'Express', 'JavaScript'],
    files: [
      {
        name: 'package.json',
        type: 'file',
        path: 'package.json',
        content: `{
  "name": "express-api",
  "version": "1.0.0",
  "description": "API RESTful with Express.js",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}`,
        language: 'json'
      },
      {
        name: 'index.js',
        type: 'file',
        path: 'src/index.js',
        content: `const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
        language: 'javascript'
      },
      {
        name: 'routes.js',
        type: 'file',
        path: 'src/routes/index.js',
        content: `const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;`,
        language: 'javascript'
      },
      {
        name: 'userController.js',
        type: 'file',
        path: 'src/controllers/userController.js',
        content: `// In-memory database for demo purposes
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Get all users
exports.getAllUsers = (req, res) => {
  res.json(users);
};

// Get user by ID
exports.getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
};

// Create a new user
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  const newUser = { id: newId, name, email };
  
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update a user
exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const updatedUser = { ...users[userIndex], ...(name && { name }), ...(email && { email }) };
  users[userIndex] = updatedUser;
  
  res.json(updatedUser);
};

// Delete a user
exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users = users.filter(user => user.id !== id);
  res.status(204).send();
};`,
        language: 'javascript'
      },
      {
        name: '.env',
        type: 'file',
        path: '.env',
        content: `PORT=3000`,
        language: 'plaintext'
      }
    ],
    setupCommands: ['npm install'],
    startCommand: 'npm run dev'
  },
  {
    id: 'mern-stack',
    name: 'MERN Stack',
    description: 'Aplicação full stack com MongoDB, Express, React e Node.js',
    category: 'fullstack',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    files: [
      {
        name: 'package.json',
        type: 'file',
        path: 'package.json',
        content: `{
  "name": "mern-stack",
  "version": "1.0.0",
  "description": "MERN Stack Application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "cd client && npm start",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "install-client": "cd client && npm install",
    "build-client": "cd client && npm run build",
    "heroku-postbuild": "npm run install-client && npm run build-client"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "mongoose": "^7.0.3"
  },
  "devDependencies": {
    "concurrently": "^8.0.1",
    "nodemon": "^2.0.22"
  }
}`,
        language: 'json'
      },
      {
        name: 'server.js',
        type: 'file',
        path: 'server.js',
        content: `const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/items', require('./routes/api/items'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
        language: 'javascript'
      },
      {
        name: 'items.js',
        type: 'file',
        path: 'routes/api/items.js',
        content: `const express = require('express');
const router = express.Router();

// Item Model (in a real app, this would be imported from a models directory)
let items = [
  { id: 1, name: 'Item 1', description: 'Description for Item 1' },
  { id: 2, name: 'Item 2', description: 'Description for Item 2' },
  { id: 3, name: 'Item 3', description: 'Description for Item 3' }
];

// @route   GET api/items
// @desc    Get All Items
// @access  Public
router.get('/', (req, res) => {
  res.json(items);
});

// @route   POST api/items
// @desc    Create An Item
// @access  Public
router.post('/', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ msg: 'Please include a name' });
  }
  
  const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  const newItem = { id: newId, name, description };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

// @route   DELETE api/items/:id
// @desc    Delete An Item
// @access  Public
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const found = items.some(item => item.id === id);
  
  if (!found) {
    return res.status(404).json({ msg: \`No item with the id of \${id}\` });
  }
  
  items = items.filter(item => item.id !== id);
  res.json({ msg: 'Item deleted', items });
});

module.exports = router;`,
        language: 'javascript'
      },
      {
        name: 'package.json',
        type: 'file',
        path: 'client/package.json',
        content: `{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.3.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}`,
        language: 'json'
      },
      {
        name: 'App.js',
        type: 'file',
        path: 'client/src/App.js',
        content: `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const res = await axios.post('/api/items', item);
      setItems([...items, res.data]);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(\`/api/items/\${id}\`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Stack App</h1>
      </header>
      <main>
        <ItemForm addItem={addItem} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ItemList items={items} deleteItem={deleteItem} />
        )}
      </main>
    </div>
  );
}

export default App;`,
        language: 'javascript'
      },
      {
        name: 'ItemForm.js',
        type: 'file',
        path: 'client/src/components/ItemForm.js',
        content: `import React, { useState } from 'react';

function ItemForm({ addItem }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const { name, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    addItem(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="item-form">
      <h2>Add New Item</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
          ></textarea>
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default ItemForm;`,
        language: 'javascript'
      },
      {
        name: 'ItemList.js',
        type: 'file',
        path: 'client/src/components/ItemList.js',
        content: `import React from 'react';

function ItemList({ items, deleteItem }) {
  return (
    <div className="item-list">
      <h2>Items</h2>
      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} className="item">
              <div className="item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;`,
        language: 'javascript'
      },
      {
        name: 'App.css',
        type: 'file',
        path: 'client/src/App.css',
        content: `.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 5px;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
  }
}

.item-form, .item-list {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-content {
  flex: 1;
}

.item h3 {
  margin: 0 0 5px 0;
}

.item p {
  margin: 0;
  color: #666;
}`,
        language: 'css'
      },
      {
        name: 'index.js',
        type: 'file',
        path: 'client/src/index.js',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: 'javascript'
      },
      {
        name: 'index.css',
        type: 'file',
        path: 'client/src/index.css',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

ul {
  list-style: none;
  padding: 0;
}`,
        language: 'css'
      },
      {
        name: '.env',
        type: 'file',
        path: '.env',
        content: `PORT=5000`,
        language: 'plaintext'
      }
    ],
    setupCommands: ['npm install', 'npm run install-client'],
    startCommand: 'npm run dev'
  }
];

/**
 * Obtém todos os templates de projetos
 * @returns Lista de templates de projetos
 */
export function getAllTemplates(): ProjectTemplate[] {
  return projectTemplates;
}

/**
 * Obtém um template de projeto pelo ID
 * @param id ID do template
 * @returns Template de projeto ou undefined se não encontrado
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find(template => template.id === id);
}

/**
 * Obtém templates de projetos por categoria
 * @param category Categoria dos templates
 * @returns Lista de templates de projetos da categoria especificada
 */
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return projectTemplates.filter(template => template.category === category);
}

/**
 * Obtém templates de projetos que usam uma tecnologia específica
 * @param technology Tecnologia a ser filtrada
 * @returns Lista de templates de projetos que usam a tecnologia especificada
 */
export function getTemplatesByTechnology(technology: string): ProjectTemplate[] {
  return projectTemplates.filter(template => 
    template.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
}

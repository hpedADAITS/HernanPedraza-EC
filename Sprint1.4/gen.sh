#!/bin/bash

# Exit if any command fails
set -e

# Ask for project name
read -p "Enter your project name: " PROJECT_NAME

# 1. Create a new Vite project with React + JavaScript
npm create vite@latest "$PROJECT_NAME" -- --template react

# 2. Navigate into the project folder
cd "$PROJECT_NAME"

# 3. Create the folder structure
mkdir -p src/components src/services src/styles public/assets

# 4. Create base files if they don’t exist
touch src/App.jsx src/main.jsx

# 5. Optionally, overwrite App.jsx and main.jsx with basic templates
cat > src/App.jsx << 'EOF'
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello from Vite + React!</h1>
    </div>
  );
}

export default App;
EOF

cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

# 6. Create a simple CSS file
mkdir -p src/styles
echo "body { margin: 0; font-family: sans-serif; }" > src/styles/index.css

# 7. Install dependencies
npm install

# 8. Print success message
echo "✅ Vite project '$PROJECT_NAME' set up successfully!"
echo "To start developing:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"

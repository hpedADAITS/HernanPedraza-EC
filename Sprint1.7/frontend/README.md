# Frontend - Automatic Documentation Generator

## Overview
React frontend for the Automatic Documentation Generator. Provides an intuitive UI for uploading Git repositories, viewing generated documentation, and managing processing history.

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/         # React components
│   │   ├── RepositoryUpload.js    # Upload form
│   │   ├── RepositoryUpload.css
│   │   ├── Results.js             # Results display
│   │   ├── Results.css
│   │   ├── History.js             # History list
│   │   └── History.css
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   └── .env.example        # Environment variables template
├── package.json            # Dependencies
├── .env.example            # Environment template
└── README.md               # This file
```

## Installation

1. Copy environment file:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Configure backend URL (if not localhost:3000):
```bash
# Edit .env
REACT_APP_API_URL=http://your-backend-url:3000
```

## Running the Application

### Development Mode
```bash
npm start
```

The app will start on `http://localhost:8978` (or default React port).

### Build for Production
```bash
npm run build
```

## Features

### 1. Repository Upload
- **Tab:** "New Generation"
- **Functionality:**
  - Input GitHub/Git repository URL
  - Select branch (defaults to main)
  - Form validation
  - Error handling with user-friendly messages
  - Loading state during processing

### 2. Results Management
- **Tab:** "Results"
- **Functionality:**
  - Display generated Markdown documentation
  - Toggle between rendered and raw Markdown views
  - Show processing statistics (files, classes, interfaces)
  - Download as Markdown file
  - Download as PDF file
  - Copy documentation to clipboard

### 3. Processing History
- **Tab:** "History"
- **Functionality:**
  - View all previous documentation generations
  - Display metadata (repository, branch, timestamp)
  - Show statistics for each generation
  - Quick access to view previous results
  - Time-ago display (e.g., "2 hours ago")

## Components

### RepositoryUpload
Handles user input for Git repository processing.

**Props:**
- `onProcessComplete(result)` - Called when processing completes
- `onStartProcessing()` - Called when processing starts
- `isLoading: boolean` - Loading state

**State:**
- `repositoryUrl` - Input URL
- `branch` - Git branch name
- `error` - Error message
- `success` - Success message

### Results
Displays generated documentation with multiple viewing options.

**Props:**
- `result: Object` - Processing result with documentation

**Features:**
- Rendered Markdown view with formatting
- Raw Markdown view
- Download buttons (Markdown, PDF)
- Copy to clipboard
- Loading state
- Statistics display

### History
Lists previous processing results.

**Props:**
- `items: Array` - History items
- `onSelectItem(item)` - Called when item is selected

**Features:**
- Chronological list
- Repository metadata display
- Statistics summary
- Time-ago formatting
- Direct result viewing

## Styling

### Design System
- **Colors:**
  - Primary: #667eea (purple)
  - Secondary: #764ba2 (darker purple)
  - Success: #10b981 (green)
  - Errors: #dc2626 (red)
  - Neutral: #f9fafb to #1f2937 (grays)

- **Typography:**
  - System font stack for performance
  - Monospace for code (`Courier New`)
  - Responsive font sizes

- **Layout:**
  - Flexbox-based
  - Mobile-first responsive design
  - 1200px max-width container

### CSS Architecture
- Component-scoped CSS files
- Global styles in `index.css`
- BEM-like naming conventions
- Smooth transitions and hover states

## API Integration

### Endpoints Used

#### Process Repository
```
POST http://localhost:3000/api/repository/process
Content-Type: application/json

{
  "repositoryUrl": "https://github.com/user/repo.git",
  "branch": "main"
}

Response:
{
  "success": true,
  "id": "a1b2c3d4",
  "statistics": {
    "filesFound": 15,
    "filesProcessed": 15,
    "classesFound": 8,
    "interfacesFound": 2
  },
  "documentation": {
    "markdownPath": "...",
    "pumlPath": "..."
  }
}
```

#### Get Documentation
```
GET http://localhost:3000/api/docs/{id}?format=md|pdf
```

### Axios Configuration
- Base URL from `REACT_APP_API_URL` environment variable
- 5-minute timeout for long-running operations
- Automatic error handling
- Text response type for Markdown files

## Error Handling

### User-Friendly Messages
- Missing required fields
- Invalid repository URLs
- Backend connection errors
- Network timeouts
- Processing failures

### Error Display
- Alert boxes with error icon
- Detailed error messages
- Recovery suggestions

## Performance

### Optimizations
- Lazy rendering of Markdown (on demand)
- Memoized components (where applicable)
- CSS-based animations (smooth)
- Minimal re-renders via React hooks

### Loading States
- Spinner animation during processing
- Disabled buttons during operations
- Disabled tab navigation when no data
- Progress indicators

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Environment Variables

```env
# Backend API URL (required)
REACT_APP_API_URL=http://localhost:3000

# Node environment
NODE_ENV=development

# Frontend port (set in package.json)
PORT=8978
```

## Development Tips

### Running with Backend
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm start
```

### Testing Locally
1. Ensure backend is running on port 3000
2. Start frontend on port 8978
3. Use example repositories:
   - `https://github.com/google/guava.git`
   - `https://github.com/apache/commons-lang.git`
   - `https://github.com/junit-team/junit4.git`

### Debugging
- Use React DevTools browser extension
- Check browser console for errors
- Network tab shows API requests
- Component state visible in DevTools

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 3000
- Check `REACT_APP_API_URL` in .env
- Verify CORS is enabled on backend

### "Documentation not loading"
- Check backend is returning data
- Verify API endpoint exists
- Check browser Network tab

### Port 8978 already in use
- Change port: `PORT=9000 npm start`
- Or kill process using the port

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Authentication/login
- [ ] User preferences storage
- [ ] Markdown editor
- [ ] Diagram viewer for PlantUML
- [ ] Search and filter history
- [ ] Export as PDF directly
- [ ] Team collaboration features
- [ ] Repository bookmarks
- [ ] Advanced filtering

## Dependencies

### Main
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `react-scripts` - Build tooling

### Dev
- `tailwindcss` - CSS framework (optional, not currently used)
- `postcss` - CSS processing
- `autoprefixer` - Vendor prefixes

## Related Files

- Backend: `../backend/` - Node.js API server
- Docker: `../docker/` - Containerization
- Setup: `../setup/` - Environment setup scripts

## Notes

- The application requires a running backend server
- Results are stored in component state (not persisted)
- For production, implement persistent storage
- Markdown rendering is basic; consider using `react-markdown` for full support
- PDF download requires backend implementation

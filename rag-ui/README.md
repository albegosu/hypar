# PKM RAG UI

Personal Knowledge Management frontend built with Nuxt 3 + Nuxt UI.

## Features

- 📱 Mobile-first design with bottom navigation
- 🔍 Semantic search with RAG support
- 📄 Document upload (text, markdown, files)
- 🤖 AI-powered responses with source citations
- 🌙 Dark mode support

## Stack

- **Nuxt 3** - Vue framework
- **Nuxt UI** - Component library
- **Pinia** - State management
- **VueUse** - Utilities
- **Tailwind CSS** - Styling

## Setup

```bash
# Install dependencies
npm install

# Configure API URL
# Create .env file:
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Start dev server
npm run dev
```

## Project Structure

```
rag-ui/
├── assets/css/         # Global styles
├── components/         # Vue components
│   ├── AppHeader.vue
│   └── BottomNav.vue
├── layouts/            # Nuxt layouts
│   └── default.vue
├── pages/              # Application pages
│   ├── index.vue       # Search + home
│   ├── documents/
│   │   └── index.vue   # Document list
│   └── upload.vue      # Upload page
├── stores/             # Pinia stores
│   └── documents.ts    # API interactions
├── nuxt.config.ts
└── package.json
```

## API Integration

The UI connects to `rag-api` (NestJS backend):

- `POST /documents` - Create text document
- `POST /documents/upload` - Upload file
- `GET /documents` - List documents
- `POST /search` - Semantic search
- `POST /search/rag` - RAG query

## Pages

### Home (Search)
- Natural language search
- Toggle RAG mode for AI responses
- Results with similarity scores
- Recent documents quick access

### Documents
- List all documents
- Search/filter documents
- Document metadata (chunks, date)

### Upload
- Text input (title + content)
- File upload (drag & drop)
- Auto-chunking on backend

## Development

```bash
# Start with hot reload
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate
```

## Next Steps

- [ ] Document detail page
- [ ] Chunk visualization
- [ ] Related documents
- [ ] Tag system
- [ ] Full-screen reader mode

## License

Private - Alberto

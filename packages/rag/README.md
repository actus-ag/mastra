# @actus-ag/mastra-rag

The Retrieval-Augmented Generation (RAG) module contains document processing and embedding utilities.

## Installation

```bash
npm install @actus-ag/mastra-rag
```

## Components

### Document

The `MDocument` class represents text content with associated metadata:

```typescript
import { MDocument } from '@actus-ag/mastra-rag';

const doc = new MDocument({
  text: 'Document content',
  metadata: { source: 'example.txt' },
});
```

[Documentation](https://mastra.ai/reference/rag/document)

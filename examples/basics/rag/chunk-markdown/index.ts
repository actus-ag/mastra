import { MDocument } from '@actus-ag/mastra-rag';

const doc = MDocument.fromMarkdown('# Your markdown content...');

const chunks = await doc.chunk();

console.log(chunks);

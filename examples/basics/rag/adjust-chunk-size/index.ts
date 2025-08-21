import { MDocument } from '@datawarp/mastra-rag';

const doc = MDocument.fromText('Your plain text content...');

const chunks = await doc.chunk({
  size: 512,
});

console.log(chunks);

import { MDocument } from '@actus-ag/mastra-rag';

const doc = MDocument.fromText('Your plain text content...');

const chunks = await doc.chunk();

console.log(chunks);

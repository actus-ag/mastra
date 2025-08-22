import { openai } from '@ai-sdk/openai';
import { PineconeVector } from '@actus-ag/mastra-pinecone';
import { MDocument } from '@actus-ag/mastra-rag';
import { embedMany } from 'ai';

const doc = MDocument.fromText('Your text content...');

const chunks = await doc.chunk();

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: chunks.map(chunk => chunk.text),
});

const pinecone = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY!,
});

await pinecone.createIndex({
  indexName: 'testindex',
  dimension: 1536,
});

await pinecone.upsert({
  indexName: 'testindex',
  vectors: embeddings,
  metadata: chunks?.map(chunk => ({ text: chunk.text })),
});

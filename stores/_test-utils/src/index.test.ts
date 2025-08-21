import { MockStore } from '@datawarp/mastra-core/storage';
import { createTestSuite } from './factory';

createTestSuite(new MockStore());

import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfills antes de MSW
import { TextEncoder, TextDecoder } from 'util';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;
globalThis.TransformStream = TransformStream;

// Stub mínimo de BroadcastChannel para Jest (no es polyfill real)
if (typeof globalThis.BroadcastChannel === 'undefined') {
  class FakeBroadcastChannel {
    constructor() {}
    postMessage() {}
    addEventListener() {}
    removeEventListener() {}
    close() {}
  }
  globalThis.BroadcastChannel = FakeBroadcastChannel;
}

// Cargar MSW DESPUÉS de los polyfills
let server;

beforeAll(async () => {
  const mod = await import('./tests/msw/server.js');
  server = mod.server;
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => server?.resetHandlers());
afterAll(() => server?.close());

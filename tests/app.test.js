import request from 'supertest';
import { jest } from '@jest/globals';

process.env.CHALLENGE = 'false';
process.env.NODE_ENV = 'test';

jest.unstable_mockModule('node-fetch', () => ({
  default: jest.fn(),
}));

const { app, cache } = await import('../index.js');
const fetch = (await import('node-fetch')).default;

describe('Server routes', () => {
  beforeEach(() => {
    cache.clear();
    fetch.mockReset();
  });

  test('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  test('GET /unknown should return 404', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });

  test('caches assets from /e routes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => Buffer.from('hello'),
    });

    const path = '/e/1/file.txt';
    let res = await request(app).get(path);
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(cache.has(path)).toBe(true);

    res = await request(app).get(path);
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

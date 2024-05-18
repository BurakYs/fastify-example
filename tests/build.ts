import { afterAll, beforeAll } from 'vitest';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import server from '../src/index';

beforeAll(async () => {
    await server.create();
});

afterAll(async () => {
    await server.server.close();
});

export default server.server;
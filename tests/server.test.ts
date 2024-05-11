import { expect, test } from 'vitest';
import server from '../src/server';

test('Test server type', async () => {
    expect(server).toBeInstanceOf(Function);
});
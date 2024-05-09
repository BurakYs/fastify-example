import 'module-alias/register';

import server from '../src/server';
import tap from 'tap';

tap.test('server', async (t) => {
    t.equal(typeof server, 'function');
});
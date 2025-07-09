import fs from 'node:fs';
import path from 'node:path';

const extensions = ['.ts', '/index.ts', ''];

const srcPath = path.resolve(process.cwd(), 'src');
const srcPrefix = '@/';

const testsPath = path.resolve(process.cwd(), 'tests');
const testsPrefix = '@/tests/';

function resolvePath(specifier) {
    const root = specifier.startsWith(testsPrefix) ? testsPath : srcPath;
    const filePath = specifier.startsWith(testsPrefix) ? specifier.slice(testsPrefix.length) : specifier.slice(srcPrefix.length);

    for (const ext of extensions) {
        const fullPath = path.resolve(root, filePath + ext);
        if (fs.existsSync(fullPath)) {
            if (!fs.statSync(fullPath).isDirectory()) {
                return `file://${fullPath}`;
            }
        }
    }

    return null;
}

export function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
        const resolved = resolvePath(specifier);

        if (resolved) {
            return {
                url: resolved,
                shortCircuit: true
            };
        }
    }

    return nextResolve(specifier, context);
}

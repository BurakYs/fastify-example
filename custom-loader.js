import fs from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve(process.cwd(), 'src');
const extensions = ['.ts', '.js', '/index.ts', '/index.js'];

function resolvePath(basePath) {
    for (const ext of extensions) {
        const fullPath = path.resolve(srcRoot, basePath + ext);
        if (fs.existsSync(fullPath)) {
            return `file://${fullPath}`;
        }
    }

    return null;
}

export function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
        const path = specifier.slice(2);
        const resolved = resolvePath(path);

        if (resolved) {
            return {
                url: resolved,
                shortCircuit: true
            };
        }
    }

    return nextResolve(specifier, context);
}

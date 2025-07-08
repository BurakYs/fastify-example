import { z } from 'zod/v4';

export function urlValidationFunction(url: string) {
    const urlRegex = /https:\/\/[a-z0-9-]+(.[a-z0-9-]+)+([/?].*)?$/;
    return urlRegex.test(url);
}

export default z.string().describe('URL to shorten').refine(urlValidationFunction, { message: 'Invalid URL provided' });

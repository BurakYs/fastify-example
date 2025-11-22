import { z } from 'zod';

export function urlValidationFunc(url: string) {
  const urlRegex = /https:\/\/[a-z0-9-]+(.[a-z0-9-]+)+([/?].*)?$/;
  return urlRegex.test(url);
}

export default z.string().describe('URL to shorten').refine(urlValidationFunc, { message: 'Invalid URL provided' });

import { z } from 'zod';

export function slugValidator(slug: string) {
  const slugRegex = /^[a-zA-Z0-9]+$/;
  return slugRegex.test(slug);
}

export const slugValidation = z
  .string()
  .describe('Slug of the shortened URL')
  .refine(slugValidator, { message: 'Slug can only contain letters and numbers' });

export function urlValidator(url: string) {
  const urlRegex = /https:\/\/[a-z0-9-]+(.[a-z0-9-]+)+([/?].*)?$/;
  return urlRegex.test(url);
}

export const urlValidation = z
  .string()
  .describe('URL to shorten')
  .refine(urlValidator, { message: 'Invalid URL provided' });

export const createUrlBody = z.object({
  url: urlValidation
});

export const getUrlParams = z.object({
  slug: slugValidation
});

export const deleteUrlParams = z.object({
  slug: slugValidation
});

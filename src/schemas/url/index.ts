import { z } from 'zod';
import sendZodError from '@/schemas/sendZodError';
import urlValidation from '@/utils/validations/url/url';
import slugValidation from '@/utils/validations/url/slug';

export const urlCreate = z.object({
    url: z.string().describe('URL to shorten').refine((url) => sendZodError(urlValidation, url, ['url']))
});
export type URLCreate = z.infer<typeof urlCreate>;

export const urlRedirect = z.object({
    slug: z.string().describe('Slug to redirect').refine((slug) => sendZodError(slugValidation, slug, ['slug']))
});
export type URLRedirect = z.infer<typeof urlRedirect>;

export const urlDelete = z.object({
    slug: z.string().describe('Slug to delete').refine((slug) => sendZodError(slugValidation, slug, ['slug']))
});
export type URLDelete = z.infer<typeof urlDelete>;
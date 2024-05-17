import { z } from 'zod';
import sendZodError from '@/helpers/validations/sendZodError';
import urlValidation from '@/helpers/validations/url/url';
import slugValidation from '@/helpers/validations/url/slug';

export const URLCreate = z.object({
    url: z.string().describe('URL to shorten').refine((url) => sendZodError(urlValidation, url, ['url']))
});
export type URLCreateT = z.infer<typeof URLCreate>;

export const URLRedirect = z.object({
    slug: z.string().describe('Slug to redirect').refine((slug) => sendZodError(slugValidation, slug, ['slug']))
});
export type URLRedirectT = z.infer<typeof URLRedirect>;

export const URLDelete = z.object({
    slug: z.string().describe('Slug to delete').refine((slug) => sendZodError(slugValidation, slug, ['slug']))
});
export type URLDeleteT = z.infer<typeof URLDelete>;
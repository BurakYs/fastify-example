import { z } from 'zod';
import slugValidation from '@/utils/validations/url/slug';
import urlValidation from '@/utils/validations/url/url';

export const urlCreate = z.object({
    url: urlValidation
});
export type URLCreate = z.infer<typeof urlCreate>;

export const urlRedirect = z.object({
    slug: slugValidation
});
export type URLRedirect = z.infer<typeof urlRedirect>;

export const urlDelete = z.object({
    slug: slugValidation
});
export type URLDelete = z.infer<typeof urlDelete>;

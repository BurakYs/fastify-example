import { z } from 'zod';
import slugValidation from '@/utils/validations/url/slug';
import urlValidation from '@/utils/validations/url/url';

export const urlCreate = z.object({
    url: urlValidation
});

export const urlRedirect = z.object({
    slug: slugValidation
});

export const urlDelete = z.object({
    slug: slugValidation
});

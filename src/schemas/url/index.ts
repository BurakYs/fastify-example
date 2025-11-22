import { z } from 'zod';
import slugValidation from '@/utils/validations/url/slug';
import urlValidation from '@/utils/validations/url/url';

export const urlCreateBody = z.object({
  url: urlValidation
});

export const urlRedirectParams = z.object({
  slug: slugValidation
});

export const urlDeleteParams = z.object({
  slug: slugValidation
});

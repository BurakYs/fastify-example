import { z } from 'zod';

export function slugValidationFunction(slug: string) {
    const slugRegex = new RegExp('^[a-zA-Z0-9]+$');
    return slugRegex.test(slug);
}

export default z
    .string()
    .describe('Slug of the shortened URL')
    .refine(slugValidationFunction, { message: 'Slug can only contain letters and numbers' });
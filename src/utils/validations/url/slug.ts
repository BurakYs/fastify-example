import { z } from 'zod/v4';

export function slugValidationFunction(slug: string) {
    const slugRegex = /^[a-zA-Z0-9]+$/;
    return slugRegex.test(slug);
}

export default z.string().describe('Slug of the shortened URL').refine(slugValidationFunction, { message: 'Slug can only contain letters and numbers' });

import { z } from 'zod';

export function slugValidationFunc(slug: string) {
    const slugRegex = /^[a-zA-Z0-9]+$/;
    return slugRegex.test(slug);
}

export default z.string().describe('Slug of the shortened URL').refine(slugValidationFunc, { message: 'Slug can only contain letters and numbers' });

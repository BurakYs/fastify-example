import { z } from 'zod';

export const queryTest = z.object({
    name: z.string().min(3).max(255),
    age: z.number().int().positive(),
    human: z.boolean().default(true)
});
export type QueryTest = z.infer<typeof queryTest>;
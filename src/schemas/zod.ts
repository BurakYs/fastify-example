import { z } from 'zod';

export const QuerySchema = z.object({
    hello: z.string().describe('Parameter description').min(3).max(10)
});
export type QueryType = z.infer<typeof QuerySchema>;

export const BodySchema = z.object({
    hello: z.string().describe('Parameter description').min(3).max(10)
});
export type BodyType = z.infer<typeof BodySchema>;

export const ParamsSchema = z.object({
    id: z.string().describe('Parameter description').uuid()
});
export type ParamsType = z.infer<typeof ParamsSchema>;
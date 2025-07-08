export {};

declare module 'fastify' {
    interface FastifyReply {
        sendError: (status: number, message: unknown, otherProperties?: Record<string, unknown>) => FastifyReply;
        sendSuccess: (status: number, data: unknown) => FastifyReply;
    }
}

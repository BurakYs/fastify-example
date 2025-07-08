import type { FastifyReply } from 'fastify';

type SendCustomResponse = (status: number, message: unknown, otherProperties?: Record<string, unknown>) => FastifyReply;

declare module 'fastify' {
    interface FastifyReply {
        sendSuccess: SendCustomResponse;
        sendError: SendCustomResponse;
    }
}

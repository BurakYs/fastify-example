import { FastifyReply as FastifyRes } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        clientIp: string;
    }

    interface FastifyReply {
        sendSuccess: (message: unknown, status: number, otherProperties?: Record<string, any>) => FastifyRes;
        sendError: (message: unknown, status: number, otherProperties?: Record<string, any>) => FastifyRes;
    }
}
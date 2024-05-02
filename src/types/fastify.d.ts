import { FastifyReply as FastifyRes } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        clientIp: string;
    }

    interface FastifyReply {
        sendSuccess: (message: any, status: number, otherProperties?: any) => FastifyRes;
        sendError: (message: any, status: number, otherProperties?: any) => FastifyRes;
    }
}
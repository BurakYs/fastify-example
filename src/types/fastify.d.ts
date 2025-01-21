import { FastifyReply } from 'fastify';

type SendCustomResponse = (status: number, message: unknown, otherProperties?: Record<string, unknown>) => FastifyReply;

declare module 'fastify' {
  interface FastifyRequest {
    clientIp: string;
  }

  interface FastifyReply {
    sendSuccess: SendCustomResponse;
    sendError: SendCustomResponse;
  }
}
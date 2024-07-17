import type { FastifyRequest } from 'fastify';

export default function ip(request: FastifyRequest) {
    request.clientIp = (request.headers['x-forwarded-for'] as string || request.ip).split(',').at(-1)!;
}